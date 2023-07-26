import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation_Room } from './conversation_room.entity';

@Entity()
export class Conversation_User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  user_id: number;

  @Column({ default: false })
  active_flag: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(
    () => Conversation_Room,
    (conversation_room) => conversation_room.id,
  )
  conversation_room: Conversation_Room;
}
