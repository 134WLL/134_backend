import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { StatisticsModule } from './statistics/statistics.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TeamsModule,
    StatisticsModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
