import { User } from '../../../../../../user/data/user.entity';
import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pds_basic_permanent_address')
export class PermanentAddress extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'permanent_address_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'house_number', nullable: true })
  houseNumber: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  subdivision: string;

  @Column()
  barangay: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column({ name: 'zip_code' })
  zipCode: string;
}
