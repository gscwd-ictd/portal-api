import { LeaveApplicationStatus } from '../utils/leave-application.enum';

export class UpdateLeaveApplicationHrdmStatusDto {
  id: string;
  hrdmApprovedBy: string;
  status: LeaveApplicationStatus;
  hrdmApprovalDate: Date;
  hrdmDisapprovalRemarks?: string;
}
