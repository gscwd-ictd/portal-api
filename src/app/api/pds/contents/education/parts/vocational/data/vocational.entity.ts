import { IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Education } from '../../../data/education.entity';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_education_vocational')
export class Vocational extends Education implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'vocational_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column()
  degree: string;

  @Column({ default: null })
  units: string;
}
