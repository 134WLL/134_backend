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

  @Column()
  energy: number;

  @Column()
  relation: number;

  @Column()
  stress: number;

  @Column()
  stable: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
