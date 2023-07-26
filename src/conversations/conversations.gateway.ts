import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { Conversation_User } from './entities/conversation.entity';
import { ConversationsService } from './conversations.service';

@WebSocketGateway({
  namespace: '/conversations',
  cors: { origin: '*' },
})
export class ConversationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private conversationsService: ConversationsService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: Conversation_User,
  ): Promise<void> {
    await this.conversationsService.createMessage(client, payload);
    this.server.emit('recMessage', payload);
  }

  @SubscribeMessage('enterChatRoom')
  handleEnterRoom(client: Socket, room_id: string) {
    client.join(room_id);
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
