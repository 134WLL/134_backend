import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class User_Status {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ default: 0 })
  energy: number;

  @Column({ default: 0 })
  relation: number;

  @Column({ default: 0 })
  stress: number;

  @Column({ default: 0 })
  stable: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @OneToOne(() => User, (user) => user.user_status)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
