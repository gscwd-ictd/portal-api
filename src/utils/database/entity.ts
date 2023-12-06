import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class DatabaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export interface IEntity {
  _id: string;
}

export interface IPdsEntity extends IEntity {
  employeeId: string;
}
