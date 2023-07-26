import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConversationsRepository } from './conversations.repository';
import { Socket } from 'socket.io';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationRepository: ConversationsRepository,
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
  ) {}

  chooseKeyword(conversationRoomId, userId, body) {
    const [first_subject, second_subject, third_subject] = body;
  }

  chooseCard(body) {}

  async createRoom(team, body) {
    const { id, timeout } = team;

    const options = {
      where: { id },
      order: {
        name: 'ASC',
      },
    };

    const find_team = await this.conversationRepository.roomFindOne(options);
    let conversation_room_name: number;
    if (!find_team) {
      conversation_room_name = 1;
    } else {
      conversation_room_name = find_team.name + 1;
    }

    const createRoom = await this.conversationRepository.roomSave({
      teamId: id,
      timeout,
      name: conversation_room_name,
    });

    body.forEach((e) => {
      this.conversationRepository.userSave({
        conversationRoomId: createRoom.id,
        user_id: e.user.id,
      });
    });
  }

  async createMessage(client: Socket, payload) {}

  // createRoom(client: Socket, room_name) {
  //   const room_id = `ro`;
  //   const nickname = client.data.nickname;
  //   client.rooms.clear();
  //   client.join(room_id);
  // }

  enterRoom(client: Socket, room_id) {
    client.data.room_id = room_id;
    client.rooms.clear();
    client.join(room_id);
    const { nickname } = client.data;
  }

  exitRoom(client: Socket, room_id) {
    client.data.room_id = `room:lobby`;
    client.rooms.clear();
    client.join(`room:lobby`);
    const { nickname } = client.data;
  }

  getRoom(room_id) {}

  getRoomList() {}

  deletRoom(room_id) {}
}
