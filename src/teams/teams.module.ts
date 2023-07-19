import { Module, forwardRef } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamsRepository } from './teams.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), forwardRef(() => UsersModule)],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
