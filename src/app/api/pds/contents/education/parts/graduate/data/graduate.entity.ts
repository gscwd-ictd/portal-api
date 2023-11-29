import { IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Education } from '../../../data/education.entity';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_education_graduate')
export class Graduate extends Education implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'graduate_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column()
  degree: string;

  @Column({ default: null })
  units: string;
}
