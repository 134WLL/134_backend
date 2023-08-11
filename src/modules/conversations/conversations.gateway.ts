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
import { Cron } from '@nestjs/schedule';

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
    const data = await this.conversationsService.enterRoom(client, payload);
    this.server
      .to(`${payload.conversation_room_id}`)
      .emit('recConversationRoom', data);
  }

  @SubscribeMessage('sendNotify')
  async notifyMessage(client: Socket, payload) {
    const data = await this.conversationsService.sendNotify(client, payload);

    const check_data = await this.conversationsService.enterRoom(client, {
      conversation_room_id: payload.conversation_room_id,
      conversation_user_id: payload.conversation_user_id,
    });

    this.server.to(`${payload.conversation_room_id}`).emit('recNotify', data);

    this.server
      .to(`${payload.conversation_room_id}`)
      .emit('recConversationRoom', check_data);

    // setTimeout(() => {
    //   this.server.to(`${payload.conversation_room_id}`).emit('recNotify', data);

    //   this.server
    //     .to(`${payload.conversation_room_id}`)
    //     .emit('recConversationRoom', check_data);
    // }, 3000);
  }

  @SubscribeMessage('sendQuestion')
  async getQuestion(client: Socket, payload) {
    const data = await this.conversationsService.sendQuestion(client, payload);

    const check_data = await this.conversationsService.enterRoom(client, {
      conversation_room_id: payload.conversation_room_id,
      conversation_user_id: payload.conversation_user_id,
    });

    this.server.to(`${payload.conversation_room_id}`).emit('recQuestion', data);

    this.server
      .to(`${payload.conversation_room_id}`)
      .emit('recConversationRoom', check_data);
  }

  @SubscribeMessage('sendNextQuestion')
  async nextQuestion(
    client: Socket,
    payload: {
      conversation_room_id: number;
      conversation_user_id: number;
      question_number: number; // 받은 qusetion_number에 +1 해서 보냄
    },
  ) {
    const data = await this.conversationsService.sendNextQuestion(
      client,
      payload,
    );

    const check_data = await this.conversationsService.enterRoom(client, {
      conversation_room_id: payload.conversation_room_id,
      conversation_user_id: payload.conversation_user_id,
    });

    this.server.to(`${payload.conversation_room_id}`).emit('recNotify', data);

    this.server
      .to(`${payload.conversation_room_id}`)
      .emit('recConversationRoom', check_data);
  }

  @SubscribeMessage('getEmotion')
  async getEmotion(
    client: Socket,
    payload: { conversation_room_id: number; conversation_user_id: number },
  ) {
    const data = await this.conversationsService.getEmotion(client, payload);
    this.server.to(`${client.id}`).emit('recNewEmotion', data.recNewData);
  }

  @SubscribeMessage('sendEmotion')
  async sendEmotion(
    client: Socket,
    payload: {
      conversation_room_id: number;
      conversation_user_id: number;
      receive_user_id: number; // 감정 받는 사람의 user_id
      emotion_code: number; // 위의 감정표 참고
    },
  ) {
    const data = await this.conversationsService.sendEmotion(client, payload);

    this.server
      .to(`${data.rec_client_id}`)
      .emit('recNewEmotion', data.recNewData);
    this.server
      .to(`${payload.conversation_room_id}`)
      .emit('recEmotion', data.recdata);
  }

  @Cron('*/10 * * * * *')
  async checkTimeout(client: Socket) {
    const { end_data, return_data } =
      await this.conversationsService.checkTimeOut(client);

    end_data.forEach((room) => {
      this.server.to(`${room.id}`).emit('recAlert', { alert_five_minute: 1 });
    });
    return_data.forEach((room) => {
      this.server.to(`${room.id}`).emit('recAlert', { alert_five_minute: 0 });
    });
  }

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
