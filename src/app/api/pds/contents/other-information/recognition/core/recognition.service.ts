import { AddRecognitionDTO } from './../data/recognition.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Recognition } from '../data/recognition.entity';

@Injectable()
export class RecognitionService extends PdsCrudHelper<Recognition> {
  constructor(
    @InjectRepository(Recognition)
    private readonly recognitionRepository: Repository<Recognition>,
  ) {
    super(recognitionRepository);
  }

  async addRecognition(employeeId: string, recognitionDTO: AddRecognitionDTO) {
    try {
      console.log(recognitionDTO);
      const addRecognition = await Promise.all(
        recognitionDTO.add.map(async (recognitionItem) => {
          const { _id, isEdited, ...rest } = recognitionItem;
          return await this.createRecord(rest);
          // else {
          //   const deleteResult = await this.deleteRecord(_id);
          //   if (deleteResult.affected > 0) return { deleted: recognitionItem };
          // }
        }),
      );

      const updateRecognition = await Promise.all(
        recognitionDTO.update.map(async (recognitionItem) => {
          const { _id, isEdited, ...rest } = recognitionItem;
          if ((await this.updateRecord(_id, rest)).affected > 0) {
            return recognitionItem;
          }
        }),
      );

      const deleteRecognition = await Promise.all(
        recognitionDTO.delete.map(async (recognitionItem) => {
          const { _id, ...rest } = recognitionItem;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return recognitionItem;
        }),
      );
      const res = await this.findAllPdsEmployeeId(employeeId);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
