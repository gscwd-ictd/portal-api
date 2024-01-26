import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get access to the request object
    const request = context.switchToHttp().getRequest();

    // check if request headers has cookie, and throw an error if there's none
    console.log(request.sessionStore);
    if (!request.headers.cookie) throw new UnauthorizedException();

    // allow the request to push through
    return true;
  }
}
