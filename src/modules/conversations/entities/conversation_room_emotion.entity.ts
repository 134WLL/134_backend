import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation_Room } from './conversation_room.entity';

@Entity()
export class Conversation_Room_Emotion {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ default: 0 })
  love_count: number;

  @Column({ default: 0 })
  like_count: number;

  @Column({ default: 0 })
  hug_count: number;

  @Column({ default: 0 })
  sad_count: number;

  @Column({ default: 0 })
  right_count: number;

  @Column({ default: 0 })
  angry_count: number;

  @OneToOne(
    () => Conversation_Room,
    (conversation_room) => conversation_room.conversation_room_emotion,
  )
  @JoinColumn({ name: 'conversation_room_id' })
  conversation_room: Conversation_Room;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
