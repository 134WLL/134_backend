import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation_User } from './conversation.entity';
import { Team } from 'src/teams/entities/team.entity';

@Entity()
export class Conversation_Room {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  name: number;

  @Column()
  timeout: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => Team, (team) => team.id)
  team: Team;

  @OneToMany(
    () => Conversation_User,
    (conversation_user) => conversation_user.conversation_room,
  )
  conversation_user: Conversation_User[];
}
