import { DatabaseEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkExperienceSheetBasic } from '../../basic/data/basic.entity';

@Entity('pds_work_experience_sheet_accomplishments')
export class WorkExperienceSheetAccomplishments extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'basic_id' })
  _id: string;

  @ManyToOne(() => WorkExperienceSheetBasic, (workExperienceSheetBasic) => workExperienceSheetBasic._id)
  @JoinColumn({ name: 'work_experience_sheet_basic_id_fk' })
  workExperienceSheetBasicId: WorkExperienceSheetBasic;

  @Column({ type: 'text' })
  accomplishment: string;
}
