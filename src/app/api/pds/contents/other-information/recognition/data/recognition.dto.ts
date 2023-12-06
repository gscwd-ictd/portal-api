import { Recognition } from './recognition.entity';
export class RecognitionDTO {
  _id?: string;
  employeeId: string;
  recognition: string;
  isEdited?: boolean;
}
export type RecognitionType = Omit<RecognitionDTO, 'employeeId'>;

export class AddRecognitionDTO {
  add: RecognitionType[];
  update: RecognitionType[];
  delete: RecognitionType[];
}
