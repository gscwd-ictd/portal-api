import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

export const handleJwtError = (errorName: string) => {
  console.log(errorName);
  switch (errorName) {
    case 'TokenExpiredError': {
      throw new HttpException('OTP code is expired', HttpStatus.UNAUTHORIZED);
    }

    case 'JsonWebTokenError': {
      throw new HttpException('Failed to verify OTP token', HttpStatus.UNAUTHORIZED);
    }
  }
};
