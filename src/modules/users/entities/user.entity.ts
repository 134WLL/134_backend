import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types/user-role.type';
import { User_Status } from './user_status.entity';
import { User_Notify } from './user_notify.entity';
import { Team } from 'src/modules/teams/entities/team.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string | null;

  @Column({ nullable: true })
  nickname: string | null;

  @Column({ nullable: true })
  emotion_code: number | null;

  @Column({ nullable: true })
  action_code: number | null;

  @Column({ nullable: true })
  state_code: number | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Column({ nullable: true })
  profile_image_url: string | null;

  @Column({ default: false })
  register_confirm: boolean;

  @Column({ nullable: true })
  hashed_refresh_token: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => User_Status, (user_status) => user_status.user)
  user_status: User_Status[];

  @OneToOne(() => User_Notify, (user_notify) => user_notify.user)
  user_notify: User_Notify;

  @ManyToOne(() => Team, (team) => team.id)
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
