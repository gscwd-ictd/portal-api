import { map } from 'rxjs';
import {
  EligibilityDeleteDTO,
  EligibilityUpdateDTO,
  EligibilityAddDTO,
  EligibilityType,
} from './../data/eligibility.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Eligibility } from '../data/eligibility.entity';

@Injectable()
export class EligibilityService extends PdsCrudHelper<Eligibility> {
  constructor(
    @InjectRepository(Eligibility)
    private readonly eligibilityRepository: Repository<Eligibility>,
  ) {
    super(eligibilityRepository);
  }

  async getEligibility(employeeId: string) {
    try {
      const _eligibilities = await this.eligibilityRepository.query(
        `
          SELECT eligibility_id _id, name, rating, exam_date examDate, exam_place examPlace, license_number licenseNumber, DATE_FORMAT(validity,'%Y-%m-%d') validity FROM pds_eligibility
          WHERE user_id_fk=? ORDER BY exam_date DESC;
      `,
        [employeeId],
      );

      console.log(_eligibilities);

      const eligibilities = await Promise.all(
        _eligibilities.map(async (eligibility) => {
          const { examDate, ...rest } = eligibility;
          const examDateFromTo = examDate.split(' to ');
          if (examDateFromTo.length === 2)
            return { ...rest, examDate: { from: examDateFromTo[0], to: examDateFromTo[1] } };
          return { ...rest, examDate: { from: examDateFromTo[0], to: null } };
        }),
      );

      return eligibilities;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getEligibilityByEmployeeId(employeeId: string) {
    try {
      const _eligibilities = await this.findAllPdsEmployeeId(employeeId);
      const eligibilities = await Promise.all(
        _eligibilities.map(async (eligibility) => {
          const { examDate, ...rest } = eligibility;
          const examDateFromTo = examDate.split(' to ');
          if (examDateFromTo.length === 2)
            return { ...rest, examDate: { from: examDateFromTo[0], to: examDateFromTo[1] } };
          return { ...rest, examDate: { from: examDateFromTo[0], to: null } };
        }),
      );
      return eligibilities;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteEligibilities(eligibilityDeleteDTO: EligibilityDeleteDTO) {
    try {
      const eligibilities = await this.eligibilityRepository.query(`SELECT * FROM pds_eligibility WHERE _id IN (?)`, [
        eligibilityDeleteDTO.eligibilityIds,
      ]);
      const deleteResult = await this.eligibilityRepository.query(`DELETE FROM pds_eligibility WHERE _id IN (?)`, [
        eligibilityDeleteDTO.eligibilityIds,
      ]);

      if (deleteResult.affectedRows > 0) return eligibilities;
    } catch (error) {}
  }

  async deleteEligibilities2(eligibilityId: string) {
    try {
      const deleteResult = await this.deleteRecord(eligibilityId);
      if (deleteResult.affected > 0) return { deletedEligibilityId: eligibilityId };
    } catch (error) {}
  }

  async addEligibility(employeeId: string, eligibilityDTO: EligibilityType) {
    try {
      const { examDateFrom, examDateTo, examDate, ...rest } = eligibilityDTO;
      const _examDate = this.concatExamDate(eligibilityDTO.examDate);
      return await this.createRecord({ employeeId, examDate: _examDate, ...rest });
    } catch (error) {}
  }

  private concatExamDate(examDate: { to: string; from: string }) {
    const { to, from } = examDate;
    let _examDate = '';
    if (to === null) _examDate = from;
    else _examDate = from + ' to ' + to;
    return _examDate;
  }

  async addEligibilities(employeeId: string, eligibilityAddDTO: EligibilityAddDTO) {
    try {
      const addEligibilities = await Promise.all(
        eligibilityAddDTO.add.map(async (eligibility) => {
          const { _id, isEdited, isOneDayOfExam, ...rest } = eligibility;
          return await this.addEligibility(employeeId, rest);
        }),
      );

      const updateEligibilities = await Promise.all(
        eligibilityAddDTO.update.map(async (eligibility) => {
          const { _id, examDateFrom, examDateTo, examDate, isEdited, isOneDayOfExam, ...rest } = eligibility;
          const _examDate = this.concatExamDate(eligibility.examDate);
          console.log(_examDate);
          const updateResult = await this.updateRecord(_id, { examDate: _examDate, ...rest });
          if (updateResult.affected > 0) return eligibility;
        }),
      );

      const deleteEligibilities = await Promise.all(
        eligibilityAddDTO.delete.map(async (eligibility) => {
          const { _id, isEdited, isOneDayOfExam, ...rest } = eligibility;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return eligibility;
        }),
      );

      const eligibilities = await this.getEligibility(employeeId);

      return eligibilities;
    } catch (error) {
      console.log(eligibilityAddDTO);
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async updateEligibilities(eligibilityDTO: EligibilityUpdateDTO) {
    try {
      const eligibilities = await Promise.all(
        eligibilityDTO.eligibilities.map(async (eligibility) => {
          const { _id, examDate, ...rest } = eligibility;
          const updateResult = await this.eligibilityRepository
            .createQueryBuilder()
            .update()
            .set(rest)
            .where({
              _id,
            })
            .execute();
          if (updateResult.affected > 0) return eligibility;
        }),
      );
      return eligibilities;
    } catch (error) {}
  }
}
