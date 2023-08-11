import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { TeamsRepository } from './teams.repository';
import * as bcrypt from 'bcrypt';
import { ConversationsService } from 'src/modules/conversations/conversations.service';
import { ConversationsGateway } from 'src/modules/conversations/conversations.gateway';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepository: TeamsRepository,
    @Inject(forwardRef(() => ConversationsService))
    private readonly converationsService: ConversationsService,
    private readonly conversationsGateway: ConversationsGateway,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createTeam(id, team_name) {
    const { random_code, hashed_random_code } = await this.createTeamCode();
    const team = await this.teamsRepository.save({
      editor_id: id,
      company: team_name,
      code: random_code,
      hashed_code: hashed_random_code,
    });
    return team;
  }

  async createTeamCode() {
    try {
      const random_code = Math.random().toString(36).substring(2, 11);

      const salt = await bcrypt.genSalt();
      const hashed_random_code = await bcrypt.hash(random_code, salt);
      return { random_code, hashed_random_code };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async joinTeam(team_code) {
    try {
      const team = await this.teamsRepository.findOne({ code: team_code });

      if (!team) {
        throw new ForbiddenException('Access Denied');
      }
      return team;
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTeamInformation(id: number) {
    try {
      return await this.teamsRepository.findOne({ id });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTeamTimeout(id: number) {
    try {
      const find_team = await this.teamsRepository.findOne({ id });
      return { timeout: find_team.timeout };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTeamUsers(id) {
    try {
      const options = `
      SELECT user.id, user.nickname, user.name, user.profile_image_url
      FROM team
        INNER JOIN user
        ON user.team_id = ${id}
      WHERE team.id = ${id}`;

      return await this.teamsRepository.query(options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateTeam(id, body) {
    try {
      return await this.teamsRepository.update(id, body);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async createTeamConversation(id: number, body) {
    try {
      const find_team = await this.teamsRepository.findOne({ id });
      if (!find_team) {
        throw new ForbiddenException('Access Denied');
      }

      await this.converationsService.createRoom(find_team, body);

      this.conversationsGateway.server.emit('createRoom', { type: 'new' });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getTeamConversationRooms(userInfo, id: number) {
    try {
      let options;
      let find_teams;

      if (userInfo.role === 'guest') {
        const new_team = [];

        options = `
        SELECT conversation_room.name, conversation_room.id AS conversation_room_id, conversation_room.state_flag AS conversation_flag 
        FROM team
          INNER JOIN conversation_room
          ON conversation_room.team_id =${id}
        WHERE team.id = ${id}
        AND conversation_room.progress_flag = true`;

        find_teams = await this.teamsRepository.query(options);

        if (find_teams.length) {
          await Promise.all(
            find_teams.map(async (team) => {
              let flag = 0;
              const options = `
              SELECT *
              FROM conversation_user
              WHERE conversation_room_id = ${team.conversation_room_id}
              `;
              const find_user = await this.converationsService.findUser(
                options,
              );

              find_user.forEach((user) => {
                if (user.user_id == userInfo.id) {
                  flag = 1;
                  team.remained_feedback = user.remained_feedback;
                }
              });

              if (flag == 1) {
                const [find_room_emotion] =
                  await this.converationsService.findConversationRoomEmotion(
                    `SELECT *
                  FROM conversation_room_emotion
                  WHERE conversation_room_id = ${team.conversation_room_id}`,
                  );

                let conversation_emotions = [
                  {
                    emotion_name: 'Love',
                    emotion_count: find_room_emotion.love_count,
                  },
                  {
                    emotion_name: 'Like',
                    emotion_count: find_room_emotion.like_count,
                  },
                  {
                    emotion_name: 'Hug',
                    emotion_count: find_room_emotion.hug_count,
                  },
                  {
                    emotion_name: 'Sad',
                    emotion_count: find_room_emotion.sad_count,
                  },
                  {
                    emotion_name: `You're right`,
                    emotion_count: find_room_emotion.right_count,
                  },
                  {
                    emotion_name: 'Angry',
                    emotion_count: find_room_emotion.angry_count,
                  },
                ];
                conversation_emotions.sort(
                  (a, b) => b.emotion_count - a.emotion_count,
                );

                const result_emotions = conversation_emotions.filter(
                  (emotion) => emotion.emotion_count > 0,
                );

                if (result_emotions.length > 3) {
                  team.emotions = [
                    conversation_emotions[0],
                    conversation_emotions[1],
                    conversation_emotions[2],
                  ];
                } else {
                  team.emotions = result_emotions;
                }

                team.user_info = [];
                team.re_join_flag = false;

                await Promise.all(
                  find_user.map(async (user) => {
                    const find_user_second = await this.usersService.findOne({
                      id: user.user_id,
                    });

                    if (user.user_id == userInfo.id) {
                      team.conversation_user_id = user.id;
                      team.join_flag = true;

                      if (user.enter_record == true) {
                        team.re_join_flag = true;
                      }
                    }
                    team.user_info.push(find_user_second.name);
                  }),
                );
                team.join_flag = true;

                new_team.push(team);
              }
            }),
          );
        }

        // conversation_room_emotion = await

        find_teams = new_team;
      } else if (userInfo.role === 'editor') {
        options = `SELECT conversation_room.name, conversation_room.id AS conversation_room_id, conversation_room.state_flag AS conversation_flag 
        FROM team
          INNER JOIN conversation_room
          ON conversation_room.team_id =${id}
        WHERE team.id = ${id}
        AND conversation_room.progress_flag = true`;

        find_teams = await this.teamsRepository.query(options);

        if (find_teams.length) {
          await Promise.all(
            find_teams.map(async (conversation_team) => {
              conversation_team.conversation_user_id = null;
              conversation_team.join_flag = false;
              conversation_team.re_join_flag = false;

              const [find_room_emotion] =
                await this.converationsService.findConversationRoomEmotion(
                  `SELECT *
                  FROM conversation_room_emotion
                  WHERE conversation_room_id = ${conversation_team.conversation_room_id}`,
                );

              let conversation_emotions = [
                {
                  emotion_name: 'Love',
                  emotion_count: find_room_emotion.love_count,
                },
                {
                  emotion_name: 'Like',
                  emotion_count: find_room_emotion.like_count,
                },
                {
                  emotion_name: 'Hug',
                  emotion_count: find_room_emotion.hug_count,
                },
                {
                  emotion_name: 'Sad',
                  emotion_count: find_room_emotion.sad_count,
                },
                {
                  emotion_name: `You're right`,
                  emotion_count: find_room_emotion.right_count,
                },
                {
                  emotion_name: 'Angry',
                  emotion_count: find_room_emotion.angry_count,
                },
              ];
              conversation_emotions.sort(
                (a, b) => b.emotion_count - a.emotion_count,
              );

              const result_emotions = conversation_emotions.filter(
                (emotion) => emotion.emotion_count > 0,
              );

              if (result_emotions.length > 3) {
                conversation_team.emotions = [
                  conversation_emotions[0],
                  conversation_emotions[1],
                  conversation_emotions[2],
                ];
              } else {
                conversation_team.emotions = result_emotions;
              }

              let user_options = `
              SELECT *
              FROM conversation_user
              WHERE conversation_room_id = ${conversation_team.conversation_room_id}`;

              const find_user = await this.converationsService.findUser(
                user_options,
              );

              conversation_team.user_info = [];
              await Promise.all(
                find_user.map(async (user) => {
                  const find_user_second = await this.usersService.findOne({
                    id: user.user_id,
                  });

                  if (user.user_id == userInfo.id) {
                    conversation_team.remained_feedback =
                      user.remained_feedback;
                    conversation_team.conversation_user_id = user.id;
                    conversation_team.join_flag = true;
                    if (user.enter_record == true) {
                      conversation_team.re_join_flag = true;
                    }
                  }
                  conversation_team.user_info.push(find_user_second.name);
                }),
              );
            }),
          );
        }
      }

      return { conversation_room: find_teams };

      // const find_team = await this.
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getSearchTeamConversationRooms(userInfo, id: number, name) {
    try {
      let options;
      let find_teams;

      if (userInfo.role === 'guest') {
        const new_team = [];

        options = `
        SELECT conversation_room.name, conversation_room.id AS conversation_room_id, conversation_room.state_flag AS conversation_flag 
        FROM team
          INNER JOIN conversation_room
          ON conversation_room.team_id =${id}
        WHERE team.id = ${id}
        AND conversation_room.progress_flag = true`;

        // const conversationOption = `
        // SELECT name, id AS conversation_room_id, state_flag AS conversation_flag
        // FROM conversation_room
        // WHERE team_id = ${id}
        // AND prgress_flag = true`;

        // find_teams = await this.converationsService.conversationRoomQuery(
        //   options,
        // );

        find_teams = await this.teamsRepository.query(options);

        // conversation_room_emotion = await

        await Promise.all(
          find_teams.map(async (team) => {
            let flag = 0;
            const options = `
            SELECT *
            FROM conversation_user
            WHERE conversation_room_id = ${team.conversation_room_id}
            `;
            const find_user = await this.converationsService.findUser(options);

            find_user.forEach((user) => {
              if (user.user_id == userInfo.id) {
                flag = 1;
                team.remained_feedback = user.remained_feedback;
              }
            });

            if (flag == 1) {
              const [find_room_emotion] =
                await this.converationsService.findConversationRoomEmotion(
                  `SELECT *
                FROM conversation_room_emotion
                WHERE conversation_room_id = ${team.conversation_room_id}`,
                );

              let conversation_emotions = [
                {
                  emotion_name: 'Love',
                  emotion_count: find_room_emotion.love_count,
                },
                {
                  emotion_name: 'Like',
                  emotion_count: find_room_emotion.like_count,
                },
                {
                  emotion_name: 'Hug',
                  emotion_count: find_room_emotion.hug_count,
                },
                {
                  emotion_name: 'Sad',
                  emotion_count: find_room_emotion.sad_count,
                },
                {
                  emotion_name: `You're right`,
                  emotion_count: find_room_emotion.right_count,
                },
                {
                  emotion_name: 'Angry',
                  emotion_count: find_room_emotion.angry_count,
                },
              ];
              conversation_emotions.sort(
                (a, b) => b.emotion_count - a.emotion_count,
              );

              const result_emotions = conversation_emotions.filter(
                (emotion) => emotion.emotion_count > 0,
              );

              if (result_emotions.length > 3) {
                team.emotions = [
                  conversation_emotions[0],
                  conversation_emotions[1],
                  conversation_emotions[2],
                ];
              } else {
                team.emotions = result_emotions;
              }

              team.user_info = [];
              team.re_join_flag = false;

              await Promise.all(
                find_user.map(async (user) => {
                  const find_user_second = await this.usersService.findOne({
                    id: user.user_id,
                  });

                  if (user.user_id == userInfo.id) {
                    team.conversation_user_id = user.id;
                    team.join_flag = true;

                    if (user.enter_record == true) {
                      team.re_join_flag = true;
                    }
                  }
                  team.user_info.push(find_user_second.name);
                }),
              );

              team.join_flag = true;

              let searchCheck = false;

              team.user_info.forEach((user_name) => {
                if (user_name.includes(`${name}`)) {
                  searchCheck = true;
                }
              });

              if (searchCheck) {
                new_team.push(team);
              }
            }
          }),
        );
        find_teams = new_team;
      } else if (userInfo.role === 'editor') {
        const new_team = [];

        options = `SELECT conversation_room.name, conversation_room.id AS conversation_room_id, conversation_room.state_flag AS conversation_flag 
        FROM team
          INNER JOIN conversation_room
          ON conversation_room.team_id =${id}
        WHERE team.id = ${id}
        AND conversation_room.progress_flag = true`;

        find_teams = await this.teamsRepository.query(options);

        await Promise.all(
          find_teams.map(async (conversation_team) => {
            conversation_team.conversation_user_id = null;
            conversation_team.join_flag = false;
            conversation_team.re_join_flag = false;

            const [find_room_emotion] =
              await this.converationsService.findConversationRoomEmotion(
                `SELECT *
                FROM conversation_room_emotion
                WHERE conversation_room_id = ${conversation_team.conversation_room_id}`,
              );

            let conversation_emotions = [
              {
                emotion_name: 'Love',
                emotion_count: find_room_emotion.love_count,
              },
              {
                emotion_name: 'Like',
                emotion_count: find_room_emotion.like_count,
              },
              {
                emotion_name: 'Hug',
                emotion_count: find_room_emotion.hug_count,
              },
              {
                emotion_name: 'Sad',
                emotion_count: find_room_emotion.sad_count,
              },
              {
                emotion_name: `You're right`,
                emotion_count: find_room_emotion.right_count,
              },
              {
                emotion_name: 'Angry',
                emotion_count: find_room_emotion.angry_count,
              },
            ];
            conversation_emotions.sort(
              (a, b) => b.emotion_count - a.emotion_count,
            );

            const result_emotions = conversation_emotions.filter(
              (emotion) => emotion.emotion_count > 0,
            );

            if (result_emotions.length > 3) {
              conversation_team.emotions = [
                conversation_emotions[0],
                conversation_emotions[1],
                conversation_emotions[2],
              ];
            } else {
              conversation_team.emotions = result_emotions;
            }

            let user_options = `
            SELECT *
            FROM conversation_user
            WHERE conversation_room_id = ${conversation_team.conversation_room_id}`;

            const find_user = await this.converationsService.findUser(
              user_options,
            );

            conversation_team.user_info = [];
            await Promise.all(
              find_user.map(async (user) => {
                const find_user_second = await this.usersService.findOne({
                  id: user.user_id,
                });

                if (user.user_id == userInfo.id) {
                  conversation_team.remained_feedback = user.remained_feedback;
                  conversation_team.conversation_user_id = user.id;
                  conversation_team.join_flag = true;
                  if (user.enter_record == true) {
                    conversation_team.re_join_flag = true;
                  }
                }
                conversation_team.user_info.push(find_user_second.name);
              }),
            );

            let searchCheck = false;

            conversation_team.user_info.forEach((user_name) => {
              if (user_name.includes(`${name}`)) {
                searchCheck = true;
              }
            });

            if (searchCheck) {
              new_team.push(conversation_team);
            }
          }),
        );
        find_teams = new_team;
      }

      return { conversation_room: find_teams };

      // const find_team = await this.
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  // where title like '%아디다스%';
}
