import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findConversationUserById(conversation_room_id: number) {
    try {
      return await this.conversationUserRepository.query(`
      SELECT *
      FROM conversation_user
      WHERE conversation_room_id = ${conversation_room_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findConversationUserByUserId(user_id: number) {
    try {
      return await this.conversationUserRepository.query(`
      SELECT *
      FROM conversation_user
      WHERE user_id = ${user_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findConversationUserByRoomIdUserId(
    conversation_room_id: number,
    user_id: number,
  ) {
    try {
      return await this.conversationUserRepository.query(`
      SELECT *
      FROM conversation_user
      WHERE conversation_room_id = ${conversation_room_id}
      AND user_id = ${user_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findConversationUserByIdRoomId(
    id: number,
    conversation_room_id: number,
  ) {
    try {
      return await this.conversationUserRepository.query(`
      SELECT *
      FROM conversation_user
      WHERE id = ${id}
      AND conversation_room_id = ${conversation_room_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findConversationUserByUserIdDate(id: number, date) {
    try {
      return await this.conversationUserRepository.query(`
      SELECT *
      FROM conversation_user
      WHERE user_id = ${id}
      AND remained_feedback = 2
      AND DATE_FORMAT(created_at, '%Y-%m-%d' ) = '${date}'`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findEndConversationRoomByTeamId(team_id: number) {
    try {
      return await this.conversationRoomRepository.query(`
      SELECT *
      FROM conversation_room
      WHERE team_id = ${team_id}
      AND state_flag = 2`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findEndTime() {
    try {
      return await this.conversationRoomRepository.query(`
      SELECT *
      FROM conversation_room
      WHERE progress_flag = true
      AND end_time_alarm = false
      AND end_at < NOW()`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  async findMiddleTime() {
    try {
      return await this.conversationRoomRepository.query(`
      SELECT *
      FROM conversation_room
      WHERE conversation_room.progress_flag = true
      AND started_socket = 1
      AND remained_time_alarm = false
      AND alarm_at < DATE_SUB(NOW(),INTERVAL 5 MINUTE)
      AND end_at > NOW()`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
