import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../../utils/types/auth-type';

export const User = createParamDecorator((data: AuthenticatedUser, context: ExecutionContext) => {
  // get access to the request object
  const request = context.switchToHttp().getRequest();
  console.log('USER cookie', request.session)
  // set the data to the current user in session
  data = request.session.user;
  console.log('as asd asdd', data);
  // return the data
  return data;
});
