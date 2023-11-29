import { DatabaseEntity, IEntity } from '../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/data/user.entity';

@Entity('pending_users')
export class PendingUser extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pending_user_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id, { nullable: false, eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id_fk' })
  userId: string;

  @Column({ name: 'token', unique: true })
  token: string;
}
