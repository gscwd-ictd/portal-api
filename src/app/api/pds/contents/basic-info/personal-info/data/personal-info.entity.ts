import { CivilStatus, Citizenship, CitizenshipType, BloodType } from '../../../../../pds/misc/pds.enum';
import { DatabaseEntity, IPdsEntity } from '../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../user/data/user.entity';

@Entity('pds_basic_personal_info')
export class PersonalInfo extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'personal_info_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({
    name: 'civil_status',
    type: 'enum',
    enum: CivilStatus,
    default: CivilStatus.SINGLE,
  })
  civilStatus: CivilStatus;

  @Column({ name: 'birth_place' })
  birthPlace: string;

  @Column()
  country: string;

  @Column({ type: 'enum', enum: Citizenship, default: Citizenship.FILIPINO })
  citizenship: Citizenship;

  @Column({
    name: 'citizenship_type',
    type: 'enum',
    enum: CitizenshipType,
    default: CitizenshipType.NONE,
    nullable: true,
  })
  citizenshipType: CitizenshipType;

  @Column({ type: 'decimal', precision: 3, scale: 2 }) //1.66
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 }) //900.00
  weight: number;

  @Column({
    name: 'blood_type',
    type: 'enum',
    enum: BloodType,
    default: BloodType.O_PLUS,
  })
  bloodType: BloodType;

  @Column({ name: 'telephone_number', nullable: true })
  telephoneNumber: string;
}
