import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../app/api/user/core/user.service';
import { UserCredentials } from '../../utils/types/auth-type';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // access the request object
    const request = context.switchToHttp().getRequest();

    // verify if user is valid based on credentials
    const user = await this.userService.verifyUser(request.body as UserCredentials);
    console.log('asd ', user);
    // set userId as session
    request.session.user = user;
    // allow the request
    return true;
  }
}
