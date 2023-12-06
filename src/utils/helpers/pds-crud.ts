import { HttpException, HttpStatus } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CrudHelper } from './crud';

export abstract class PdsCrudHelper<T> extends CrudHelper<T> {
  constructor(private readonly pdsRepository: Repository<T>) {
    super(pdsRepository);
  }

  async findAllPdsEmployeeId(employeeId: string): Promise<Array<T>> {
    return await this.pdsRepository.createQueryBuilder().select().where({ employeeId }).getMany();
  }

  async findPdsByEmployeeId(employeeId: string): Promise<T> {
    try {
      return await this.pdsRepository.createQueryBuilder().select().where({ employeeId }).getOneOrFail();
    } catch (error) {
      throw new HttpException({ message: 'No PDS record found', details: error }, HttpStatus.NOT_FOUND);
    }
  }

  async updatePdsByEmployeeId(employeeId: string, pdsDto: any): Promise<UpdateResult> {
    try {
      return await this.pdsRepository.createQueryBuilder().update().set(pdsDto).where({ employeeId }).execute();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: 'Failed to update PDS record', details: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePdsByEmployeeId(employeeId: string): Promise<DeleteResult> {
    try {
      return await this.pdsRepository.delete(employeeId);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to delete PDS record', details: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
