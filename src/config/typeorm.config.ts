import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { Conversation_User } from 'src/modules/conversations/entities/conversation_user.entity';
import { Conversation_Room } from 'src/modules/conversations/entities/conversation_room.entity';
import { Conversation_Room_Emotion } from 'src/modules/conversations/entities/conversation_room_emotion.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Team } from 'src/modules/teams/entities/team.entity';
import { User_Status } from 'src/modules/users/entities/user_status.entity';
import { User_Notify } from 'src/modules/users/entities/user_notify.entity';
import { Keyword } from 'src/modules/keywords/entities/keyword.entity';
import { Question } from 'src/modules/keywords/entities/question.entity';
import { Emotion } from 'src/modules/emotions/entities/emotion.entity';
import { Emotion_User } from 'src/modules/emotions/entities/emotion_user.entity';
import { Feedback } from 'src/modules/feedback/entities/feedback.entity';
import { Feedback_User } from 'src/modules/feedback/entities/feedback_user.entity';

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
    Feedback,
    Feedback_User,
  ],
  logging: false,
  synchronize: true,
};
