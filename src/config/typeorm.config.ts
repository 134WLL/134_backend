import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { User_Status } from 'src/users/entities/user_status.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Team, User_Status],
  logging: false,
  synchronize: false,
};
