import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { StatisticsModule } from './statistics/statistics.module';
import { ConversationsModule } from './conversations/conversations.module';
import { FeedbackModule } from './feedback/feedback.module';
import { KeywordsModule } from './keywords/keywords.module';
import { EmotionsModule } from './emotions/emotions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UsersModule,
    TeamsModule,
    StatisticsModule,
    ConversationsModule,
    FeedbackModule,
    KeywordsModule,
    EmotionsModule,
  ],
  controllers: [],
})
export class AppModule {}
