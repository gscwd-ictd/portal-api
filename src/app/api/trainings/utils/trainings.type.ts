export type TrainingNomination = {
  id: string;
  status: TrainingNominationStatus;
  remarks: string;
};

export enum TrainingNominationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export type TrainingNominees = {
  trainingDistribution: string;
  employees: {
    employeeId: string;
    nomineeType: NomineeType;
  }[];
};

export enum NomineeType {
  STAND_IN = 'stand-in',
  NOMINEE = 'nominee',
}

export type PdcChairmanApproval = {
  pdcChairman: string;
  trainingDetails: string;
};

export type PdcChairmanDecline = {
  pdcChairman: string;
  trainingDetails: string;
  remarks: string;
};

export type PdcSecretariatApproval = {
  pdcSecretary: string;
  trainingDetails: string;
};

export type PdcSecretariatDecline = {
  pdcSecretary: string;
  trainingDetails: string;
  remarks: string;
};

export type TrainingListItem = {
  distributionId: string;
  nomineeType?: NomineeType;
};

export type GmApproval = {
  generalManager: string;
  trainingDetails: string;
};

export type GmDecline = {
  generalManager: string;
  trainingDetails: string;
  remarks: string;
};

export type NomineeTrainingStatusType = {
  employeeId: string;
  status: TrainingNominationStatus;
};
