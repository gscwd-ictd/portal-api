import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { Repository, UpdateResult } from 'typeorm';
import { Child } from '../data/children.entity';
import { ChildrenDTO, DeleteChildrenDTO, UpdateChildrenDTO } from '../data/children.dto';
import dayjs from 'dayjs';

@Injectable()
export class ChildrenService extends PdsCrudHelper<Child> {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
  ) {
    super(childRepository);
  }

  async findChildren(employeeId: string) {
    const children = await this.childRepository
      .createQueryBuilder()
      .select()
      .where({ employeeId })
      .orderBy('birth_date', 'DESC')
      .getMany();
    return children.map((child) => {
      return { ...child };
    });
  }

  async updateChildren(updateChildDTO: UpdateChildrenDTO) {
    try {
      const children = await Promise.all(
        updateChildDTO.children.map(async (child) => {
          const { _id, ...rest } = child;
          const UpdateResult = await this.childRepository
            .createQueryBuilder()
            .update()
            .set(rest)
            .where({ _id })
            .execute();
          return child;
        }),
      );
      return children;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteChildren(deleteChildDTO: DeleteChildrenDTO) {
    try {
      const children = await this.childRepository.query(`SELECT * FROM pds_family_children WHERE _id IN (?)`, [
        deleteChildDTO.children,
      ]);
      const deleteResult = await this.childRepository.query(`DELETE FROM pds_family_children WHERE _id IN (?)`, [
        deleteChildDTO.children,
      ]);

      if (deleteResult.affected > 0) return children;
    } catch (error) { }
  }

  async deleteChild(_id: string) {
    try {
      const deleteResult = await this.deleteRecord(_id);
      if (deleteResult.affected > 0) return { deletedChildId: _id };
    } catch (error) { }
  }

  async addChildren(employeeId: string, childrenDTO: ChildrenDTO) {
    try {
      const addedChildren = await Promise.all(
        childrenDTO.add.map(async (child) => {
          const { _id, ...rest } = child;
          return await this.createRecord({ employeeId, ...rest });
          // } else {
          //   const deleteResult = await this.deleteRecord(child._id);
          //   if (deleteResult.affected > 0) return { deleted: child };
          // }
        }),
      );

      const updatedChildren = await Promise.all(
        childrenDTO.update.map(async (child) => {
          const { _id, ...rest } = child;
          if ((await this.updateRecord(_id, rest)).affected > 0) return child;
        }),
      );

      const deletedChildren = await Promise.all(
        childrenDTO.delete.map(async (child) => {
          console.log(child);
          await this.childRepository.query(`DELETE FROM pds_family_children WHERE child_id = ?`, [child._id]);

          return child;
          //if ((await this.deleteRecord(child._id)).affected > 0) return child;
        }),
      );
      //sort by age
      //return await this.findAllPdsEmployeeId(employeeId);
      const children = await this.childRepository.query(
        `SELECT child_id _id, child_name childName, birth_date birthDate FROM pds_family_children WHERE user_id_fk=?`,
        [employeeId],
      );
      console.log(children);
      return children;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
