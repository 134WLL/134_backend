import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConversationsRepository } from './repositories/conversations.repository';
import { Socket } from 'socket.io';
import { TeamsService } from 'src/teams/teams.service';
import { readFileSync } from 'fs';
import { KeywordsService } from 'src/keywords/keywords.service';
import { ConversationRoomEmotionsRepository } from './repositories/conversation-room-emotions.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationRepository: ConversationsRepository,
    private readonly conversationRoomEmotionsRepository: ConversationRoomEmotionsRepository,
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
    @Inject(forwardRef(() => KeywordsService))
    private readonly keywordsService: KeywordsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createRoom(find_team, body) {
    try {
      const { user_array } = body;

      const options = {
        where: { id: find_team.id },
        order: {
          name: 'DESC',
        },
      };

      const find_conversation_room =
        await this.conversationRepository.roomFindOne(options);

      let conversation_room_name: number;

      if (!find_conversation_room) {
        conversation_room_name = 1;
      } else {
        conversation_room_name = find_conversation_room.name + 1;
      }

      const create_room = await this.conversationRepository.roomSave({
        member_count: user_array.length,
        timeout: find_team.timeout,
        name: conversation_room_name,
        team: find_team.id,
      });

      const create_room_emotion =
        await this.conversationRoomEmotionsRepository.save({
          conversation_room: create_room.id,
        });

      user_array.forEach((user_id: number) => {
        this.conversationRepository.userSave({
          conversation_room: create_room.id,
          user_id: user_id,
        });
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findConversationRoom(
    userInfo,
    conversation_room_id,
    conversation_user_id,
    body,
  ) {
    try {
      const { team_id } = body;

      const find_user = await this.conversationRepository.userFindOne({
        id: conversation_user_id,
        conversation_room: conversation_room_id,
      });

      if (find_user.join_flag == true) {
        console.log('여러번');
        return {
          check_flag: find_user.check_flag,
          conversation_room_id,
          conversation_user_id,
        };
      } else {
        const find_rooms = await this.conversationRepository.roomFind({
          progress_flag: true,
          id: conversation_room_id,
        });

        await Promise.all(
          find_rooms.map(async (room) => {
            const options = `
            SELECT *
            FROM conversation_user
            WHERE conversation_user.conversation_room_id = ${room.id}
            AND conversation_user.user_id = ${userInfo.id}
            `;

            const find_users = await this.findUser(options);

            await Promise.all(
              find_users.map(async (user) => {
                if (user.join_flag == true) {
                  await this.conversationRepository.userUpdate(user.id, {
                    check_flag: 'keyword',
                    keyword_selection: 2,
                    keyword_flag: false,
                    first_keyword: null,
                    second_keyword: null,
                    third_keyword: null,
                    question_flag: false,
                    first_question: null,
                    second_question: null,
                    third_question: null,
                    join_flag: false,
                    active_flag: false,
                  });
                }
              }),
            );
          }),
        );

        await this.conversationRepository.userUpdate(conversation_user_id, {
          join_flag: true,
        });

        return {
          check_flag: find_user.check_flag,
          conversation_room_id,
          conversation_user_id,
        };
      }
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getConversationUserKeywordCount(
    conversation_room_id,
    conversation_user_id,
  ) {
    try {
      const find_user = await this.conversationRepository.userFindOne({
        id: conversation_user_id,
        conversation_room: conversation_room_id,
      });

      return { keyword_selection: find_user.keyword_selection };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getSequenceQuestion(conversation_room_id, conversation_user_id) {
    try {
      console.log('질문조회');
      const find_user = await this.conversationRepository.userFindOne({
        id: conversation_user_id,
        conversation_room: conversation_room_id,
      });
      console.log('질문조회');
      const first_question = await this.keywordsService.getQuestionEvery(
        find_user.first_keyword,
        find_user.first_question,
      );
      const second_question = await this.keywordsService.getQuestionEvery(
        find_user.second_keyword,
        find_user.second_question,
      );
      const third_question = await this.keywordsService.getQuestionEvery(
        find_user.third_keyword,
        find_user.third_question,
      );
      console.log('질문조회');

      return {
        check_flag: find_user.check_flag,
        questions: [first_question, second_question, third_question],
      };
    } catch (err) {
      console.log(err);
    }
  }

  async chooseConversationUserKeyword(
    conversation_room_id,
    conversation_user_id,
    keyword_code,
  ) {
    try {
      const keyword_array = keyword_code.keywordCode;

      const question_code = [];
      for (let i = 0; i < keyword_array.length; i++) {
        const question = await this.keywordsService.getKeywordQuestion(
          keyword_array[i],
        );
        question_code.push(question.questions);
      }

      await this.conversationRepository.userUpdate(conversation_user_id, {
        first_keyword: keyword_array[0],
        second_keyword: keyword_array[1],
        third_keyword: keyword_array[2],
        first_question: question_code[0].id,
        second_question: question_code[1].id,
        third_question: question_code[2].id,
        keyword_selection: 1,
        keyword_flag: true,
        check_flag: 'question',
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.response);
    }
  }

  async reChooseConversationUserKeyword(
    conversation_room_id,
    conversation_user_id,
    keyword_code,
  ) {
    try {
      console.log('질문 재선택');
      console.log(keyword_code);

      const keyword_array = keyword_code.keyword_code;
      const question_code = [];

      for (let i = 0; i < keyword_array.length; i++) {
        const question = await this.keywordsService.getKeywordQuestion(
          keyword_array[i],
        );
        question_code.push(question.questions);
      }

      console.log('질문 재선택');
      await this.conversationRepository.userUpdate(conversation_user_id, {
        first_keyword: keyword_array[0],
        second_keyword: keyword_array[1],
        third_keyword: keyword_array[2],
        first_question: question_code[0].id,
        second_question: question_code[1].id,
        third_question: question_code[2].id,
        keyword_selection: 0,
        keyword_flag: true,
        check_flag: 'question',
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.response);
    }
  }

  async registerSequenceQuestion(
    conversation_room_id,
    conversation_user_id,
    question_code_list,
  ) {
    try {
      await this.conversationRepository.userUpdate(conversation_user_id, {
        first_question: question_code_list[0],
        second_question: question_code_list[1],
        third_question: question_code_list[2],
        question_flag: true,
        check_flag: 'active',
      });

      const find_conversation_room =
        await this.conversationRepository.roomFindOne({
          where: { id: conversation_room_id },
        });

      if (
        find_conversation_room.member_count ==
        find_conversation_room.member_question_count + 1
      ) {
        await this.conversationRepository.userFind({
          conversation_room: conversation_room_id,
        });

        await this.conversationRepository.roomUpdate(conversation_room_id, {
          member_question_count:
            find_conversation_room.member_question_count + 1,
        });
      } else {
        await this.conversationRepository.roomUpdate(conversation_room_id, {
          member_question_count:
            find_conversation_room.member_question_count + 1,
        });
      }
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async getOutConversationRoom(conversation_room_id, conversation_user_id) {
    try {
      const find_user = await this.conversationRepository.userFindOne({
        id: conversation_user_id,
        conversation_room: conversation_room_id,
      });
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findConversationRoomEmotion(options) {
    return await this.conversationRoomEmotionsRepository.findOne({
      where: options,
    });
  }

  async findUser(options) {
    try {
      return await this.conversationRepository.userQuery(options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findUsers(options) {
    try {
      return await this.conversationRepository.userFind(options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  // socket controller

  async enterRoom(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    client.data.room_id = payload.conversation_room_id;
    client.data.user_id = payload.conversation_user_id;
    client.rooms.clear();
    client.join(`${client.data.room_id}`);

    const [find_users, find_request_user, find_request_room] =
      await Promise.all([
        this.conversationRepository.userQuery(`
  SELECT conversation_user.user_id, id, active_flag
  FROM conversation_user
  WHERE conversation_user.conversation_room_id = ${payload.conversation_room_id}`),
        this.conversationRepository.userFindOne({
          id: payload.conversation_user_id,
        }),
        this.conversationRepository.roomFindOne({
          where: { id: payload.conversation_room_id },
        }),
      ]);

    await Promise.all([
      this.conversationRepository.userUpdate(payload.conversation_user_id, {
        check_flag: 'active',
        active_flag: true,
        enter_record: true,
      }),
      this.conversationRepository.roomUpdate(payload.conversation_room_id, {
        socket_member: find_request_room.socket_member + 1,
      }),
    ]);

    let socket_flag = 0;
    if (find_request_room.member_count == find_request_room.socket_member + 1) {
      socket_flag = 1;
    }

    const userInfo = [];

    await Promise.all(
      find_users.map(async (user) => {
        const find_user = await this.usersService.findOne({ id: user.user_id });
        let active_flag;
        if (user.active_flag || user.id == payload.conversation_user_id) {
          active_flag = 1;
        } else {
          active_flag = 0;
        }
        if (user.id == payload.conversation_user_id) {
          active_flag = 1;
        }

        userInfo.push({
          id: find_user.id, // user_id
          nickname: find_user.nickname,
          name: find_user.name,
          profile_image_url: find_user.profile_image_url,
          active_flag: active_flag,
        });
      }),
    );

    return { socket_flag, check_in_flag: true, user_info: userInfo };
  }

  async sendNotify(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    return '';
  }

  async sendQuestion(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    return '';
  }

  async sendEmotion() {}

  async exitRoom(client: Socket) {
    const room_id = client.data.room_id;
    const user_id = client.data.user_id;
    if (room_id && user_id) {
      const [find_request_user, find_request_room] = await Promise.all([
        this.conversationRepository.userFindOne({
          id: user_id,
        }),
        this.conversationRepository.roomFindOne({
          where: { id: room_id },
        }),
      ]);

      await Promise.all([
        this.conversationRepository.userUpdate(user_id, {
          active_flag: false,
        }),
        this.conversationRepository.roomUpdate(room_id, {
          socket_member: find_request_room.socket_member - 1,
        }),
      ]);
    }
    client.data.room_id = '';
    client.data.user_id = '';
  }

  getRoom(room_id) {}

  getRoomList() {}

  deletRoom(room_id) {}
}
