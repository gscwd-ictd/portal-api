import { DatabaseEntity, IPdsEntity } from '../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../user/data/user.entity';

@Entity('pds_family_parents')
export class Parents extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'parents_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'father_first_name' })
  fatherFirstName: string;

  @Column({ name: 'father_middle_name' })
  fatherMiddleName: string;

  @Column({ name: 'father_last_name' })
  fatherLastName: string;

  @Column({ name: 'father_name_extension', default: null, nullable: true })
  fatherNameExtension: string;

  @Column({ name: 'mother_first_name' })
  motherFirstName: string;

  @Column({ name: 'mother_middle_name' })
  motherMiddleName: string;

  @Column({ name: 'mother_last_name' })
  motherLastName: string;

  @Column({ name: 'mother_maiden_name', nullable: true })
  motherMaidenName: string;
}
