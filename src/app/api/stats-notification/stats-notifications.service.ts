import { Injectable } from '@nestjs/common';
import { LeaveApplicationsService } from '../leave-applications/core/leave-applications.service';
import { DtrCorrectionsService } from '../dtr-corrections/dtr-corrections.service';
import { AuthenticatedUser } from '../../../utils/types/auth-type';
import { OvertimeApplicationService } from '../overtime-applications/core/overtime-applications.service';
import { EmployeeService } from '../employee/core/employee.service';
import { TrainingsService } from '../trainings/trainings.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StatsNotificationsService {
  constructor(
    private readonly leaveApplicationsService: LeaveApplicationsService,
    private readonly dtrCorrectionsService: DtrCorrectionsService,
    private readonly overtimeApplicationsService: OvertimeApplicationService,
    private readonly employeeService: EmployeeService,
    private readonly trainingsService: TrainingsService,
  ) {}

  async getForApprovalNotifications(user: AuthenticatedUser) {
    const employeeDetails = await this.employeeService.getEmployeeDetailsFromHr(user._id);

    console.log(employeeDetails);
    const positionTitle = employeeDetails.assignment.positionTitle;
    const pendingTrainingNominationCount =
      positionTitle === 'Division Manager A' ||
      positionTitle === 'Department Manager A' ||
      positionTitle === 'Assistant General Manager' ||
      positionTitle === 'General Manager A' ||
      positionTitle === 'OIC-Division Manager' ||
      positionTitle === 'OIC-Department Manager' ||
      positionTitle === 'OIC-Assistant General Manager' ||
      positionTitle === 'OIC-General Manager'
        ? (await this.trainingsService.pendingTrainingNominationCount(user)).nominationPending
        : null;
    const pendingPdcSecretariatApprovalCount = employeeDetails.isPdcSecretariat
      ? (await this.trainingsService.pendingPdcSecretariatApprovalCount()).pendingApproval
      : null;

    const pendingPdcChairmanApprovalCount = employeeDetails.isPdcChairman
      ? (await this.trainingsService.pendingPdcChairmanApprovalCount()).pendingApproval
      : null;

    const pendingGmApprovalCount =
      employeeDetails.assignment.positionTitle === 'General Manager A' ||
      employeeDetails.assignment.positionTitle === 'OIC-General Manager'
        ? (await this.trainingsService.pendingGmApprovalCount()).pendingApproval
        : null;

    const pendingDtrCorrectionsApprovals = await this.dtrCorrectionsService.getPendingDtrCorrections(user);
    const forHrdmApprovalLeaves = await this.leaveApplicationsService.getForHrdmApprovalCount(user);
    const pendingOvertimeApprovals = await this.overtimeApplicationsService.getPendingOvertimeApplicationApprovalCount(
      user,
    );

    //const emsStats =

    const prfsForApprovalCount =
      positionTitle === 'Division Manager A' ||
      positionTitle === 'Department Manager A' ||
      positionTitle === 'Assistant General Manager' ||
      positionTitle === 'General Manager A' ||
      positionTitle === 'OIC-Division Manager' ||
      positionTitle === 'OIC-Department Manager' ||
      positionTitle === 'OIC-Assistant General Manager' ||
      positionTitle === 'OIC-General Manager'
        ? await this.employeeService.getPrfsForApprovalCount(user._id)
        : null;
    const pendingApplicantEndorsementsCount =
      positionTitle === 'Division Manager A' ||
      positionTitle === 'Department Manager A' ||
      positionTitle === 'Assistant General Manager' ||
      positionTitle === 'General Manager A' ||
      positionTitle === 'OIC-Division Manager' ||
      positionTitle === 'OIC-Department Manager' ||
      positionTitle === 'OIC-Assistant General Manager' ||
      positionTitle === 'OIC-General Manager'
        ? await this.employeeService.getPendingApplicantEndorsementsCount(user._id)
        : null;
    return {
      pendingTrainingNominationCount,
      pendingDtrCorrectionsApprovals,
      forHrdmApprovalLeaves,
      pendingOvertimeApprovals,
      pendingPdcSecretariatApprovalCount,
      pendingPdcChairmanApprovalCount,
      pendingGmApprovalCount,
      prfsForApprovalCount,
      pendingApplicantEndorsementsCount,
    };
  }
}
