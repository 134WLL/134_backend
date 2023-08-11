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
import { Conversation_Room } from './conversation_room.entity';
import { Feedback } from 'src/modules/feedback/entities/feedback.entity';

@Entity()
export class Conversation_User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  client_id: string;

  // 어디까지 유저가 대화방에서 활동했는지
  @Column({ default: 'keyword' })
  check_flag: string;

  @Column({ default: 2 })
  keyword_selection: number;

  @Column({ default: false })
  keyword_flag: boolean;

  @Column({ nullable: true })
  first_keyword: string | null;

  @Column({ nullable: true })
  second_keyword: string | null;

  @Column({ nullable: true })
  third_keyword: string | null;

  @Column({ default: false })
  question_flag: boolean;

  @Column({ nullable: true })
  first_question: number | null;

  @Column({ nullable: true })
  second_question: number | null;

  @Column({ nullable: true })
  third_question: number | null;

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

  // 대화방에 접속한 기록이 있는지
  @Column({ default: false })
  join_flag: boolean;

  // 소켓 연결 중인지 아닌지
  @Column({ default: false })
  active_flag: boolean;

  // 소켓 연결을 했었는지
  @Column({ default: false })
  enter_record: boolean;

  // 0: 선택형, 1: 필수형, 2: 완료
  @Column({ default: 0 })
  remained_feedback: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @OneToOne(() => Feedback, (feedback) => feedback.conversation_user)
  feedback: Feedback;

  @ManyToOne(
    () => Conversation_Room,
    (conversation_room) => conversation_room.id,
  )
  @JoinColumn({ name: 'conversation_room_id' })
  conversation_room: Conversation_Room;
}
