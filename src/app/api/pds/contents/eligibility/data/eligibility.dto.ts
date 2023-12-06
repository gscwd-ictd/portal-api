export class EligibilityDTO {
  _id?: string;
  employeeId: string;
  name: string;
  rating: number;
  examDate: EligibilityExamDate;
  examDateFrom: string;
  examDateTo: string;
  examPlace: string;
  licenseNumber: string;
  validity: Date;
  isEdited?: boolean;
  isOneDayOfExam?: boolean;
}

export type EligibilityType = Omit<EligibilityDTO, 'employeeId'> & {
  examDate: EligibilityExamDate;
};
export type EligibilityExamDate = {
  from: string;
  to: string;
};

export class EligibilityUpdateDTO {
  eligibilities: EligibilityType[];
}

export class EligibilityDeleteDTO {
  eligibilityIds: string[];
}

export class EligibilityAddDTO {
  add: EligibilityType[];
  update: EligibilityType[];
  delete: EligibilityType[];
}
