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
