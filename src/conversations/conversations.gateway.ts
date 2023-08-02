import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ConversationsService } from './conversations.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'conversations',
  cors: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 120000,
  pingInterval: 10000,
})
export class ConversationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ConversationsGateway.name);
  constructor(private conversationsService: ConversationsService) {}

  //https://artdeveloper.tistory.com/5

  @WebSocketServer() server: Server;

  //// 0 아무도 안들어왔을 때 1 다 들어온거 2 알림 조회 3 대화진행 질문 받기

  @SubscribeMessage('enterConversationRoom')
  async connectEnterRoom(client: Socket, payload) {
    console.log(payload);
    const data = await this.conversationsService.enterRoom(client, payload);
    console.log(data);
    this.server.emit('recConversationRoom', data);
  }

  @SubscribeMessage('sendNotify')
  async notifyMessage(client: Socket, payload) {
    const data = await this.conversationsService.sendNotify(client, payload);
    console.log(data);
    this.server.emit('recNotify', {
      socket_flag: 3, // 3
      speaker: {
        id: 1, // user_id
        nickname: 'asdf',
        name: '이은총',
      },
    });
  }

  @SubscribeMessage('sendQuestion')
  getQuestion(client: Socket, payload) {
    const data = this.conversationsService.sendQuestion(client, payload);
    this.server.emit('recQuestion', {
      socket_flag: 3, // 3
      speaker: {
        id: 1, // speaker의 user_id
        name: 'ㅁㄴㅁㄴㅇㄹ',
        nickname: 'ㅁㄴㅇㄹ',
      },
      question_number: 1, // 몇 번째 대화인지
      question_last_flag: false, // 마지막 질문인지 아닌지 boolean 값으로
      user_info: [
        {
          id: 1, // user_id
          nickname: 'asdf',
          name: 'asdf',
          profile_image_url: 'asdf',
        },
      ],
      question_list: {
        keyword_name: '일',
        question_content: 'asdfaf',
        depth: '1',
        question_guide: 'ㅁㄴㅇㄹㅁㄴㄹ',
      },
    });
  }

  @SubscribeMessage('sendEmotion')
  sendEmotion(
    client: Socket,
    payload: {
      conversation_room_id: number;
      conversation_user_id: number;
      receive_user_id: number; // 감정 받는 사람의 user_id
      emotion_code: number; // 위의 감정표 참고
    },
  ) {
    this.server.emit('recEmotion', { emotion_code: 1 });
  }

  @SubscribeMessage('sendNextQuestion')
  nextQuestion(
    client: Socket,
    payload: {
      conversation_room_id: number;
      conversation_user_id: number;
      question_number: number; // 받은 qusetion_number에 +1 해서 보냄
    },
  ) {
    this.server.emit('recNotify', {
      socket_flag: 3, // 3
      speaker: {
        id: 1, // user_id
        nickname: 'asdf',
        name: 'asdf',
      },
    });
  }

  // @SubscribeMessage('sendMessage')
  // async handleSendMessage(
  //   client: Socket,
  //   payload: Conversation_User,
  // ): Promise<void> {
  //   await this.conversationsService.createMessage(client, payload);
  //   this.server.emit('recMessage', payload);
  // }

  // @SubscribeMessage('enterConversationRoom')
  // handleEnterRoom(client: Socket, room_id: string) {
  //   client.join(room_id);
  // }

  // @SubscribeMessage('ClientToServer')
  // handleMessage(@MessageBody() data) {
  //   this.server.emit('ServerToClient', data);
  // }
  afterInit(server: Server) {
    this.logger.log(`WebSocket Gateway Initialization`);
  }

  async handleDisconnect(client: Socket) {
    await this.conversationsService.exitRoom(client);
    console.log(`Disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
