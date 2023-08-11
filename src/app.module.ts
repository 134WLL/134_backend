import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { KeywordsModule } from './modules/keywords/keywords.module';
import { EmotionsModule } from './modules/emotions/emotions.module';

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
