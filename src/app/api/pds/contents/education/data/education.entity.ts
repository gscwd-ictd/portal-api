import { DatabaseEntity } from '../../../../../../utils/database/entity';
import { Column } from 'typeorm';

export abstract class Education extends DatabaseEntity {
  @Column({ name: 'school_name' })
  schoolName: string;

  @Column({ type: 'year' })
  from: number;

  @Column({ type: 'year', nullable: true })
  to: number;

  @Column({ type: 'year', name: 'year_graduated', nullable: true })
  yearGraduated: number;

  @Column()
  awards: string;
}
