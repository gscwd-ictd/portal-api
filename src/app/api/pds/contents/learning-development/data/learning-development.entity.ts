import { DatabaseEntity, IPdsEntity } from '../../../../../../utils/database/entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../../../user/data/user.entity';

@Entity('pds_learning_development')
export class LearningDevelopment extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'learning_development_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column()
  title: string;

  @Column({ name: 'conducted_by' })
  conductedBy: string;

  @Column({ name: 'type' })
  type: string;

  @Column({})
  from: Date;

  @Column({})
  to: Date;

  @Column({ name: 'number_of_hours' })
  numberOfHours: number;

  @Column({ name: 'is_wd', type: 'boolean', default: false })
  isWd: boolean;
}
