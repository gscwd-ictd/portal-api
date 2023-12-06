import { HttpException, HttpStatus } from '@nestjs/common';

export const handleRpcError = (message: string) => {
  switch (message) {
    case 'Employee not found': {
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }
};
