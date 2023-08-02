import { User } from 'src/users/entities/user.entity';
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
import { Conversation_User } from './conversation_user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Conversation_Room_Emotion } from './conversation_room_emotion.entity';

@Entity()
export class Conversation_Room {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  // 방 이름
  @Column()
  name: number;

  // 실시간 대화 시간
  @Column()
  timeout: number;

  @Column({ default: 0 })
  socket_flag: number;

  // 대화방이 오픈되어있는지
  @Column({ default: true })
  progress_flag: boolean;

  // 대화방 유저 수
  @Column()
  member_count: number;

  // 소켓 연결 유저 수
  @Column({ default: 0 })
  socket_member: number;

  // 질문 선택 유저 수
  @Column({ default: 0 })
  member_question_count: number;

  // 질문 순서
  @Column({ default: 0 })
  question_sequence: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => Team, (team) => team.id)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToOne(
    () => Conversation_Room_Emotion,
    (conversation_room_emotion) => conversation_room_emotion.conversation_room,
  )
  conversation_room_emotion: Conversation_Room_Emotion;

  @OneToMany(
    () => Conversation_User,
    (conversation_user) => conversation_user.conversation_room,
  )
  conversation_user: Conversation_User[];
}
