import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { Conversation_User } from 'src/conversations/entities/conversation_user.entity';
import { Conversation_Room } from 'src/conversations/entities/conversation_room.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';
import { Question } from 'src/keywords/entities/question.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { User_Notify } from 'src/users/entities/user_notify.entity';
import { User_Status } from 'src/users/entities/user_status.entity';
import { Emotion } from 'src/emotions/entities/emotion.entity';
import { Emotion_User } from 'src/emotions/entities/emotion_user.entity';
import { Conversation_Room_Emotion } from 'src/conversations/entities/conversation_room_emotion.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    User,
    Team,
    User_Status,
    User_Notify,
    Conversation_User,
    Conversation_Room,
    Keyword,
    Question,
    Emotion,
    Emotion_User,
    Conversation_Room_Emotion,
  ],
  logging: false,
  synchronize: false,
};
