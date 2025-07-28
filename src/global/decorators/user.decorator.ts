import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { AuthenticatedUser } from '../../utils/types/auth-type';

export const User = createParamDecorator((data: AuthenticatedUser, context: ExecutionContext) => {
  try {
    // get access to the request object
    const request = context.switchToHttp().getRequest();

    // set the data to the current user in session
    data = request.session.user;
    // console.log('as asd asdd', data);
    // return the data
    if (!data) throw new HttpException('Login to access this resource', 401);
    return data;
  } catch (error) {
    throw new HttpException(error.message, 401);
  }
});
