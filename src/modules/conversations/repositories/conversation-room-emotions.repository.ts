import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation_Room_Emotion } from '../entities/conversation_room_emotion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationRoomEmotionsRepository {
  constructor(
    @InjectRepository(Conversation_Room_Emotion)
    private conversationRoomEmotionRepository: Repository<Conversation_Room_Emotion>,
  ) {}

  async save(options) {
    return await this.conversationRoomEmotionRepository.save(options);
  }

  async find(options) {
    return await this.conversationRoomEmotionRepository.find(options);
  }

  async findOne(options) {
    return await this.conversationRoomEmotionRepository.findOne(options);
  }

  async update(id, options) {
    return await this.conversationRoomEmotionRepository.update(id, options);
  }

  async query(options) {
    return await this.conversationRoomEmotionRepository.query(options);
  }

  async findEmotionByConversationRoomId(conversation_room_id: number) {
    try {
      return await this.conversationRoomEmotionRepository.query(`
        SELECT *
        FROM conversation_room_emotion
        WHERE conversation_room_id = ${conversation_room_id}`);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
