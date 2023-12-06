import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_candidate_resigned')
export class CandidateResigned extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'candidate_resigned_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'is_candidate', type: 'boolean' })
  isCandidate: boolean;

  @Column()
  candidateDetails: string;

  @Column({ name: 'is_resigned', type: 'boolean' })
  isResigned: boolean;

  @Column()
  resignedDetails: string;
}
