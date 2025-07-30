export enum ReportHalf {
  FIRST_HALF = 'first',
  SECOND_HALF = 'second',
}

export type EmployeeDtrSchedEntry = {
  dtrId: string;
  companyId: string;
  dtrDate: Date;
  timeIn: string;
  lunchOut: string;
  lunchIn: string;
  timeOut: string;
  schedTimeIn: string;
  schedTimeOut: string;
  schedLunchIn: string;
  schedLunchOut: string;
  shift: string;
};
