import { HttpException, HttpStatus } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

export class CrudHelper<T> {
  constructor(private readonly repository: Repository<T>) {}

  async createObject(any: any): Promise<any> {
    return this.repository.create(any);
  }
  async createRecord(createDto: any): Promise<T> {
    try {
      return await this.repository.save(createDto);
    } catch (error) {
      throw new HttpException('Failed to create record', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRecords(): Promise<Array<T>> {
    return await this.repository.find();
  }

  async findRecordById(recordId: string): Promise<T> {
    try {
      return await this.repository.createQueryBuilder().select().where({ _id: recordId }).getOneOrFail();
    } catch (error) {
      throw new HttpException('Failed to find a record', HttpStatus.NOT_FOUND);
    }
  }

  async updateRecord(recordId: string, updateDto: any): Promise<UpdateResult> {
    try {
      return await this.repository.createQueryBuilder().update().set(updateDto).where({ _id: recordId }).execute();
    } catch (error) {
      throw new HttpException('Failed to update record', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteRecord(recordId: string): Promise<DeleteResult> {
    try {
      return await this.repository.delete(recordId);
    } catch (error) {
      throw new HttpException('Failed to delete record', HttpStatus.BAD_REQUEST);
    }
  }
}
