import { Injectable } from '@nestjs/common';
import { Conversation_Room } from '../entities/conversation_room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation_User } from '../entities/conversation_user.entity';

@Injectable()
export class ConversationsRepository {
  constructor(
    @InjectRepository(Conversation_Room)
    private conversationRoomRepository: Repository<Conversation_Room>,
    @InjectRepository(Conversation_User)
    private conversationUserRepository: Repository<Conversation_User>,
  ) {}

  async roomSave(options) {
    return await this.conversationRoomRepository.save(options);
  }

  async roomFind(options) {
    return await this.conversationRoomRepository.find(options);
  }

  async roomFindOne(options) {
    return await this.conversationRoomRepository.findOne(options);
  }

  async roomUpdate(id, options) {
    return await this.conversationRoomRepository.update(id, options);
  }

  async roomQuery(options) {
    return await this.conversationRoomRepository.query(options);
  }

  async userSave(options) {
    return await this.conversationUserRepository.save(options);
  }

  async userFind(options) {
    return await this.conversationUserRepository.find({ where: options });
  }

  async userFindOne(options) {
    return await this.conversationUserRepository.findOne({
      where: options,
    });
  }

  async userUpdate(id, options) {
    return await this.conversationUserRepository.update(id, options);
  }

  async userQuery(options) {
    return await this.conversationUserRepository.query(options);
  }
}
