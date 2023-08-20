import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConversationsRepository } from './repositories/conversations.repository';
import { Socket } from 'socket.io';
import { ConversationRoomEmotionsRepository } from './repositories/conversation-room-emotions.repository';
import { TeamsService } from '../teams/teams.service';
import { KeywordsService } from '../keywords/keywords.service';
import { UsersService } from '../users/users.service';

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

  async getConversationUsers(userInfo, conversation_room_id) {
    try {
      const find_users =
        await this.conversationRepository.findConversationUserById(
          conversation_room_id,
        );

      const user_info = [];

      await Promise.all(
        find_users.map(async (user) => {
          if (user.user_id != userInfo.id) {
            const find_user = await this.usersService.findOne({
              id: user.user_id,
            });

            user_info.push({
              id: find_user.id, // user_id
              nickname: find_user.nickname,
              name: find_user.name,
            });
          }
        }),
      );
      return { user_info };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

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
          conversation_room: create_room,
        });

      user_array.forEach((user_id: number) => {
        this.conversationRepository.userSave({
          conversation_room: create_room,
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
        return {
          check_flag: find_user.check_flag,
          conversation_room_id,
          conversation_user_id,
        };
      } else {
        const find_rooms = await this.conversationRepository.roomFind({
          where: {
            progress_flag: true,
          },
        });

        await Promise.all(
          find_rooms.map(async (room) => {
            const find_users =
              await this.conversationRepository.findConversationUserByRoomIdUserId(
                room.id,
                userInfo.id,
              );

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
      const find_user = await this.conversationRepository.userFindOne({
        id: conversation_user_id,
        conversation_room: conversation_room_id,
      });

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

      return {
        check_flag: find_user.check_flag,
        questions: [first_question, second_question, third_question],
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async chooseConversationUserKeyword(
    user_info,
    conversation_room_id,
    conversation_user_id,
    keyword_code,
  ) {
    try {
      const keyword_array = keyword_code.keywordCode;

      const find_conversation_user =
        await this.conversationRepository.findConversationUserByUserId(
          user_info.id,
        );

      const keyword_name_array = [];

      find_conversation_user.forEach((e) => {
        keyword_name_array.push(e.first_keyword);
        keyword_name_array.push(e.second_keyword);
        keyword_name_array.push(e.third_keyword);
      });

      const question_code = [];
      for (let i = 0; i < keyword_array.length; i++) {
        let flag = 0;

        if (keyword_name_array.includes(keyword_array[i])) {
          flag = 1;
        }

        const question = await this.keywordsService.getKeywordQuestion(
          keyword_array[i],
          user_info,
          flag,
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
      throw new BadRequestException(err.response);
    }
  }

  async reChooseConversationUserKeyword(
    user_info,
    conversation_room_id,
    conversation_user_id,
    keyword_code,
  ) {
    try {
      const keyword_array = keyword_code.keyword_code;
      const question_code = [];

      const find_conversation_users =
        await this.conversationRepository.findConversationUserByUserId(
          user_info.id,
        );

      const keyword_name_array = [];

      find_conversation_users.forEach((user) => {
        keyword_name_array.push(user.first_keyword);
        keyword_name_array.push(user.second_keyword);
        keyword_name_array.push(user.third_keyword);
      });

      for (let i = 0; i < keyword_array.length; i++) {
        let flag = 0;

        if (keyword_name_array.includes(keyword_array[i])) {
          flag = 1;
        }

        const question = await this.keywordsService.getKeywordQuestion(
          keyword_array[i],
          user_info,
          flag,
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
        keyword_selection: 0,
        keyword_flag: true,
        check_flag: 'question',
      });
    } catch (err) {
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

  async findConversationRoomEmotion(conversation_room_id: number) {
    return await this.conversationRoomEmotionsRepository.findEmotionByConversationRoomId(
      conversation_room_id,
    );
  }

  async findConversationUser(conversation_room_id: number) {
    try {
      return await this.conversationRepository.findConversationUserById(
        conversation_room_id,
      );
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async enterRoom(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    client.data.room_id = payload.conversation_room_id;
    client.data.user_id = payload.conversation_user_id;

    client.rooms.clear();
    client.join(`${payload.conversation_room_id}`);

    await this.conversationRepository.userUpdate(payload.conversation_user_id, {
      client_id: client.id,
    });

    const [find_users, find_request_user, find_request_room] =
      await Promise.all([
        this.conversationRepository.findConversationUserById(
          payload.conversation_room_id,
        ),
        this.conversationRepository.userFindOne({
          id: payload.conversation_user_id,
        }),
        this.conversationRepository.roomFindOne({
          where: { id: payload.conversation_room_id },
        }),
      ]);

    let re_enter_id;
    if (find_request_user.enter_record == false) {
      re_enter_id = null;
    } else {
      re_enter_id = payload.conversation_user_id;
    }

    await this.conversationRepository.userUpdate(payload.conversation_user_id, {
      check_flag: 'active',
      active_flag: true,
      enter_record: true,
    });

    await this.conversationRepository.roomUpdate(payload.conversation_room_id, {
      socket_member: find_request_room.socket_member + 1,
    });

    let socket_flag = 0;
    if (find_request_room.socket_flag != 2) {
      if (
        find_request_room.member_count ==
        find_request_room.socket_member + 1
      ) {
        // https://velog.io/@12aeun/SQL-mysql%EC%97%90%EC%84%9C-%EB%82%A0%EC%A7%9C-%EC%8B%9C%EA%B0%84-%EA%B3%84%EC%82%B0%ED%95%98%EA%B8%B0
        socket_flag = 1;
        await this.conversationRepository.roomUpdate(
          payload.conversation_room_id,
          {
            state_flag: 1,
            socket_flag: 2,
          },
        );
      } else {
        socket_flag = find_request_room.socket_flag;
      }
    } else if (find_request_room.socket_flag == 2) {
      socket_flag = 2;
    }

    let user_flag;

    for (let i = 1; i <= find_users.length * 3; i++) {
      if (i == find_request_room.question_sequence) {
        user_flag = (i + 1) % find_users.length;
        break;
      }
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

    return {
      speaker_id: find_users[user_flag].id,
      re_enter_id,
      socket_flag,
      check_in_flag: true,
      user_info: userInfo,
    };
  }

  async sendNotify(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    client.data.room_id = payload.conversation_room_id;
    client.data.user_id = payload.conversation_user_id;
    // client.rooms.clear();
    client.join(`${payload.conversation_room_id}`);

    const [find_users, find_request_room] = await Promise.all([
      this.conversationRepository.findConversationUserById(
        payload.conversation_room_id,
      ),

      this.conversationRepository.roomFindOne({
        where: { id: payload.conversation_room_id },
      }),
    ]);

    if (!find_request_room.started_socket) {
      await this.conversationRepository.roomUpdate(
        payload.conversation_room_id,
        {
          started_socket: true,
          alarm_at: () =>
            `DATE_ADD(NOW(), INTERVAL ${find_request_room.timeout - 5} MINUTE)`,
          end_at: () =>
            `DATE_ADD(NOW(), INTERVAL ${find_request_room.timeout} MINUTE)`,
          socket_flag: 2,
        },
      );
    } else {
      await this.conversationRepository.roomUpdate(
        payload.conversation_room_id,
        {
          socket_flag: 2,
        },
      );
    }

    let user_flag;

    for (let i = 1; i <= find_users.length * 3; i++) {
      if (i == find_request_room.question_sequence) {
        user_flag = (i + 1) % find_users.length;

        break;
      }
    }

    if (user_flag == undefined) {
      return {
        socket_flag: 2, // 3
        speaker: {
          conversation_user_id: null,
          id: null, // user_id
          nickname: null,
          name: null,
        },
      };
    } else {
      const user = await this.usersService.findOne({
        id: find_users[user_flag].user_id,
      });

      return {
        socket_flag: 2, // 3
        speaker: {
          conversation_user_id: find_users[user_flag].id,
          id: user.id, // user_id
          nickname: user.nickname,
          name: user.name,
        },
      };
    }
  }

  async sendQuestion(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    client.data.room_id = payload.conversation_room_id;
    client.data.user_id = payload.conversation_user_id;

    // client.rooms.clear();
    client.join(`${payload.conversation_room_id}`);

    const [find_users, find_request_room] = await Promise.all([
      this.conversationRepository.findConversationUserById(
        payload.conversation_room_id,
      ),
      this.conversationRepository.roomFindOne({
        where: { id: payload.conversation_room_id },
      }),
    ]);

    let user_flag = 0;
    let question_last_flag = false;
    let question_count = 1;

    for (let i = 1; i <= find_users.length * 3; i++) {
      if (i == 1) {
        question_count = 1;
      } else {
        question_count = Math.floor((i - 1) / find_users.length) + 1;
      }

      if (i == find_request_room.question_sequence) {
        if (find_users.length * 3 == i) {
          question_last_flag = true;
        }
        user_flag = (i + 1) % find_users.length;

        break;
      }
    }

    await this.conversationRepository.roomUpdate(payload.conversation_room_id, {
      socket_flag: 2,
    });

    const userInfo = [];

    await Promise.all(
      find_users.map(async (user) => {
        const find_user = await this.usersService.findOne({ id: user.user_id });

        userInfo.push({
          id: find_user.id, // user_id
          nickname: find_user.nickname,
          name: find_user.name,
          profile_image_url: find_user.profile_image_url,
        });
      }),
    );

    const user = await this.usersService.findOne({
      id: find_users[user_flag].user_id,
    });

    let question_list;

    if (question_count == 1) {
      const question = await this.keywordsService.getQuestion({
        id: find_users[user_flag].first_question,
      });
      question_list = {
        keyword_name: find_users[user_flag].first_keyword,
        question_content: question.content,
        depth: question.depth,
        question_guide: question.guide.split('\n'),
      };
    } else if (question_count == 2) {
      const question = await this.keywordsService.getQuestion({
        id: find_users[user_flag].second_question,
      });
      question_list = {
        keyword_name: find_users[user_flag].second_keyword,
        question_content: question.content,
        depth: question.depth,
        question_guide: question.guide.split('\n'),
      };
    } else if (question_count == 3) {
      const question = await this.keywordsService.getQuestion({
        id: find_users[user_flag].third_question,
      });
      question_list = {
        keyword_name: find_users[user_flag].third_keyword,
        question_content: question.content,
        depth: question.depth,
        question_guide: question.guide.split('\n'),
      };
    }

    return {
      socket_flag: 2, // 3
      speaker: {
        conversation_user_id: find_users[user_flag].id,
        id: user.id, // speaker의 user_id
        name: user.name,
        nickname: user.nickname,
      },
      question_number: find_request_room.question_sequence, // 몇 번째 대화인지
      question_last_flag, // 마지막 질문인지 아닌지 boolean 값으로
      user_info: userInfo,
      question_list,
    };
  }

  async sendNextQuestion(
    client: Socket,
    payload: {
      conversation_room_id: number;
      conversation_user_id: number;
      question_number: number; // 받은 qusetion_number에 +1 해서 보냄
    },
  ) {
    client.data.room_id = payload.conversation_room_id;
    client.data.user_id = payload.conversation_user_id;
    // client.rooms.clear();
    client.join(`${payload.conversation_room_id}`);

    const [find_users, find_request_room] = await Promise.all([
      this.conversationRepository.findConversationUserById(
        payload.conversation_room_id,
      ),
      this.conversationRepository.roomFindOne({
        where: { id: payload.conversation_room_id },
      }),
    ]);

    let user_flag = 0;

    for (let i = 1; i <= find_users.length * 3; i++) {
      if (i == find_request_room.question_sequence + 1) {
        user_flag = (i + 2) % find_users.length;
        break;
      }
    }

    if (payload.question_number == find_users.length * 3 + 1) {
      await this.conversationRepository.roomUpdate(
        payload.conversation_room_id,
        { state_flag: 2 },
      );
    } else {
      await this.conversationRepository.roomUpdate(
        payload.conversation_room_id,
        {
          question_sequence: find_request_room.question_sequence + 1,
          socket_flag: 1,
        },
      );
    }

    if (payload.question_number < find_users.length * 3 + 1) {
      const user = await this.usersService.findOne({
        id: find_users[user_flag].user_id,
      });

      return {
        socket_flag: 1, // 3
        speaker: {
          id: user.id, // user_id
          nickname: user.nickname,
          name: user.name,
        },
      };
    } else {
      return {
        socket_flag: 1, // 3
        speaker: {
          id: null, // user_id
          nickname: null,
          name: null,
        },
      };
    }
  }

  async getEmotion(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    client.data.room_id = payload.conversation_room_id;
    client.data.user_id = payload.conversation_user_id;
    // client.rooms.clear();
    client.join(`${payload.conversation_room_id}`);

    const [receive_user] =
      await this.conversationRepository.findConversationUserByIdRoomId(
        payload.conversation_user_id,
        payload.conversation_room_id,
      );

    let emotion_list = [
      {
        emotion_code: 1,
        emotion_count: receive_user.love_count,
      },
      {
        emotion_code: 2,
        emotion_count: receive_user.like_count,
      },
      {
        emotion_code: 3,
        emotion_count: receive_user.hug_count,
      },
      {
        emotion_code: 4,
        emotion_count: receive_user.sad_count,
      },
      {
        emotion_code: 5,
        emotion_count: receive_user.right_count,
      },
      {
        emotion_code: 6,
        emotion_count: receive_user.angry_count,
      },
    ];
    return {
      recNewData: { conversation_user_id: receive_user.id, emotion_list },
      receive_user: receive_user.id,
    };
  }

  async sendEmotion(
    client: Socket,
    payload: {
      conversation_room_id: number;
      conversation_user_id: number;
      receive_user_id: number;

      emotion_code: number; // 위의 감정표 참고
    },
  ) {
    client.data.room_id = payload.conversation_room_id;
    client.data.user_id = payload.conversation_user_id;
    // client.rooms.clear();
    client.join(`${payload.conversation_room_id}`);

    const [[find_request_room], [receive_user]] = await Promise.all([
      this.conversationRoomEmotionsRepository.findEmotionByConversationRoomId(
        payload.conversation_room_id,
      ),
      this.conversationRepository.findConversationUserByRoomIdUserId(
        payload.conversation_room_id,
        payload.receive_user_id,
      ),
    ]);

    let emotion_list = [
      {
        emotion_code: 1,
        emotion_count: receive_user.love_count,
      },
      {
        emotion_code: 2,
        emotion_count: receive_user.like_count,
      },
      {
        emotion_code: 3,
        emotion_count: receive_user.hug_count,
      },
      {
        emotion_code: 4,
        emotion_count: receive_user.sad_count,
      },
      {
        emotion_code: 5,
        emotion_count: receive_user.right_count,
      },
      {
        emotion_code: 6,
        emotion_count: receive_user.angry_count,
      },
    ];

    if (payload.emotion_code == 1) {
      emotion_list[0].emotion_count += 1;

      await Promise.all([
        this.conversationRoomEmotionsRepository.update(find_request_room.id, {
          love_count: find_request_room.love_count + 1,
        }),
        this.conversationRepository.userUpdate(receive_user.id, {
          love_count: receive_user.love_count + 1,
        }),
      ]);
    } else if (payload.emotion_code == 2) {
      emotion_list[1].emotion_count += 1;

      await Promise.all([
        this.conversationRoomEmotionsRepository.update(find_request_room.id, {
          like_count: find_request_room.like_count + 1,
        }),
        this.conversationRepository.userUpdate(receive_user.id, {
          like_count: receive_user.like_count + 1,
        }),
      ]);
    } else if (payload.emotion_code == 3) {
      emotion_list[2].emotion_count += 1;
      await Promise.all([
        this.conversationRoomEmotionsRepository.update(find_request_room.id, {
          like_count: find_request_room.like_count + 1,
        }),
        this.conversationRepository.userUpdate(receive_user.id, {
          like_count: receive_user.like_count + 1,
        }),
      ]);
    } else if (payload.emotion_code == 4) {
      emotion_list[3].emotion_count += 1;
      await Promise.all([
        this.conversationRoomEmotionsRepository.update(find_request_room.id, {
          sad_count: find_request_room.sad_count + 1,
        }),
        this.conversationRepository.userUpdate(receive_user.id, {
          sad_count: receive_user.sad_count + 1,
        }),
      ]);
    } else if (payload.emotion_code == 5) {
      emotion_list[4].emotion_count += 1;
      await Promise.all([
        this.conversationRoomEmotionsRepository.update(find_request_room.id, {
          right_count: find_request_room.right_count + 1,
        }),
        this.conversationRepository.userUpdate(receive_user.id, {
          right_count: receive_user.right_count + 1,
        }),
      ]);
    } else if (payload.emotion_code == 6) {
      emotion_list[5].emotion_count += 1;
      await Promise.all([
        this.conversationRoomEmotionsRepository.update(find_request_room.id, {
          angry_count: find_request_room.angry_count + 1,
        }),
        this.conversationRepository.userUpdate(receive_user.id, {
          angry_count: receive_user.angry_count + 1,
        }),
      ]);
    }

    return {
      recdata: { emotion_code: payload.emotion_code },
      recNewData: { conversation_user_id: receive_user.id, emotion_list },
      rec_client_id: receive_user.client_id,
    };
  }

  async checkTimeOut(client: Socket) {
    const [end_data, return_data] = await Promise.all([
      this.conversationRepository.findEndTime(),
      this.conversationRepository.findMiddleTime(),
    ]);

    await Promise.all(
      end_data.map(async (data) => {
        await this.conversationRepository.roomUpdate(data.id, {
          end_time_alarm: true,
        });
      }),
    );

    await Promise.all(
      return_data.map(async (data) => {
        await this.conversationRepository.roomUpdate(data.id, {
          remained_time_alarm: true,
        });
      }),
    );

    return { end_data, return_data };
  }

  todayDate() {
    const curr = new Date();

    // 2. UTC 시간 계산
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000; //한국 시간(KST)은 UTC시간보다 9시간 더 빠르므로 9시간을 밀리초 단위로 변환.
    const kr_curr = new Date(utc + KR_TIME_DIFF); //UTC 시간을 한국 시간으로 변환하기 위해 utc 밀리초 값에 9시간을 더함.

    const year = kr_curr.getFullYear();
    const month = kr_curr.getMonth() + 1;
    const day = kr_curr.getDate();
    const getHours = kr_curr.getHours();
    const getMinutes = kr_curr.getMinutes();
    return `${year}${month}${day}${getHours}${getMinutes}`;
  }

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

  async getTeamConversation(team_id) {
    try {
      const conversation_rooms =
        await this.conversationRepository.findEndConversationRoomByTeamId(
          team_id,
        );

      const users = [];

      await Promise.all(
        conversation_rooms.map(async (room) => {
          const find_users =
            await this.conversationRepository.findConversationUserById(room.id);
          find_users.forEach((user) => {
            users.push(user);
          });
        }),
      );

      return users;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async conversationRoomQuery(options) {
    try {
      return await this.conversationRepository.roomQuery(options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async conversationUserQuery(options) {
    try {
      return await this.conversationRepository.userQuery(options);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async updateConversationRoom(room_id, options) {
    try {
      await this.conversationRepository.roomUpdate(room_id, options);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async find_conversation_user(team_users) {
    try {
      await Promise.all(
        team_users.map(async (user) => {
          const find_data =
            await this.conversationRepository.findConversationUserByUserId(
              user.id,
            );
          user.conversation_count = find_data.length;
        }),
      );
      return team_users;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findConversationUsersByDate(id, date) {
    try {
      return await this.conversationRepository.findConversationUserByUserIdDate(
        id,
        date,
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findConversationsUsers(user_id) {
    try {
      return await this.conversationRepository.findConversationUserByUserId(
        user_id,
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
