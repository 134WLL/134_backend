import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from './repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { User_Status } from './entities/user_status.entity';
import { TeamsModule } from 'src/teams/teams.module';
import { Team } from 'src/teams/entities/team.entity';
import { UserNotifiesRepository } from './repositories/user-notifies.repository';
import { UserStatusRepository } from './repositories/user-status.repository';
import { User_Notify } from './entities/user_notify.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, User_Status, Team, User_Notify]),
    forwardRef(() => AuthModule),
    forwardRef(() => TeamsModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UserNotifiesRepository,
    UserStatusRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
