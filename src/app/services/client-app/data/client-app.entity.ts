import { DatabaseEntity, IEntity } from '../../../../utils/database/entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client_apps')
export class ClientApp extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'client_id' })
  _id: string;

  @Column({ name: 'client_secret' })
  secret: string;

  @Column({ name: 'client_name' })
  name: string;

  @Column({ name: 'client_description' })
  description: string;

  @Column({ name: 'callback_url' })
  callbackUrl: string;
}
