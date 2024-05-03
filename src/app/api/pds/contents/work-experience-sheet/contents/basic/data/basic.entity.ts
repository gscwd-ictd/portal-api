import { DatabaseEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkExperience } from '../../../../work-experience/data/work-experience.entity';

@Entity('pds_work_experience_sheet_basic')
export class WorkExperienceSheetBasic extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'basic_id' })
  _id: string;

  @ManyToOne(() => WorkExperience, (workExperience) => workExperience._id)
  @JoinColumn({ name: 'pds_work_experience_id_fk' })
  workExperienceId: WorkExperience;

  @Column({ name: 'posting_applicant_id_fk' })
  postingApplicantId: string;

  @Column({ name: 'office' })
  office: string;

  @Column({ name: 'supervisor' })
  supervisor: string;
}
