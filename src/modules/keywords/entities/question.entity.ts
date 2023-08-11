import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Keyword } from './keyword.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  status_map: number;

  @Column()
  guide: string;

  @Column()
  depth: number;

  @ManyToOne(() => Keyword, (keyword) => keyword.id)
  @JoinColumn({ name: 'keyword_id' })
  keyword: Keyword;
}
