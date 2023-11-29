import { DatabaseEntity, IEntity } from '../../../../utils/database/entity';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('users')
@Index('user_UNIQUE', ['_id', 'email'], { unique: true })
export class User extends DatabaseEntity implements IEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  _id: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
