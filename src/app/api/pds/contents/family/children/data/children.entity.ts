import { DatabaseEntity, IPdsEntity } from '../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../user/data/user.entity';

@Entity('pds_family_children')
export class Child extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'child_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'child_name', nullable: true })
  childName: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;
}
