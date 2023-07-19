import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  company: string;

  @Column()
  editor_id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  hashed_code: string;

  @Column({ default: 30 })
  timeout: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => User, (user) => user.id)
  user_id: User[];
}
