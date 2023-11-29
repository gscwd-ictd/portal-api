export class LearningDevelopmentDTO {
  _id?: string;
  employeeId: string;
  title: string;
  conductedBy: string;
  type: string;
  from: Date;
  to: Date;
  numberOfHours: number;
  isEdited?: boolean;
}

export type LearningDevelopmentType = Omit<LearningDevelopmentDTO, 'employeeId'>;

export class UpdateLearningDevelopmentDTO {
  learningAndDevelopment: LearningDevelopmentType[];
}

export class DeleteLearningDevelopmentDTO {
  learningAndDevelopmentIds: string[];
}

export class AddLearningDevelopmentDTO {
  add: LearningDevelopmentType[];
  update: LearningDevelopmentType[];
  delete: LearningDevelopmentType[];
}
