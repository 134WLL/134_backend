import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => Keyword, (keyword) => keyword.id)
  keyword: Keyword;
}
