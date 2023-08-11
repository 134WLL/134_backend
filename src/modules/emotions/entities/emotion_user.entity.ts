import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Emotion_User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  rec_user_id: number;

  @Column()
  send_user_id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
