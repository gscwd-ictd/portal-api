import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { EmployeeService } from '../../employee/core/employee.service';

@Injectable()
export class PdcChairmanGuard implements CanActivate {
  constructor(private readonly employeeService: EmployeeService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const id = req.session.user.email._id;

    const isPdcChairman = await this.employeeService.isPdcChairman(id);

    return isPdcChairman;
  }
}

@Injectable()
export class PdcSecretaryGuard implements CanActivate {
  constructor(private readonly employeeService: EmployeeService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const id = req.session.user.email._id;

    const isPdcSecretary = await this.employeeService.isPdcSecretariat(id);

    return isPdcSecretary;
  }
}
