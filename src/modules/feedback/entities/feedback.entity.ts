import { Conversation_User } from 'src/modules/conversations/entities/conversation_user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ nullable: true })
  content: string | null;

  @Column({ nullable: true })
  score: number;

  @OneToOne(
    () => Conversation_User,
    (conversation_user) => conversation_user.feedback,
  )
  @JoinColumn({ name: 'conversation_user_id' })
  conversation_user: Conversation_User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
