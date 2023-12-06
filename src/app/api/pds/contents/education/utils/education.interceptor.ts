import { Request } from 'express';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { EducationDTO } from '../data/education.dto';

@Injectable()
export class EducationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { yearGraduated, to, from } = request.body;
    if (yearGraduated !== '' && to === '')
      throw new HttpException('Please add Year Attended To', HttpStatus.NOT_ACCEPTABLE);
    if (from > to)
      throw new HttpException('Year Attended From must earlier than Year Attended to', HttpStatus.NOT_ACCEPTABLE);
    return next.handle().pipe(map((data: any) => ({ ...data })));
  }
}

@Injectable()
export class EducationsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { education } = request.body;

    education.map((educationItem) => {
      //console.log(educationItem);
      const { yearGraduated, to, from } = educationItem;
      if (yearGraduated !== '' && to === '')
        throw new HttpException('Please add Year Attended To', HttpStatus.NOT_ACCEPTABLE);
      if (from > to)
        throw new HttpException('Year Attended From must earlier than Year Attended to', HttpStatus.NOT_ACCEPTABLE);
    });
    return next.handle().pipe(map((data: any) => ({ ...data })));
  }
}

/*

  schoolName: string;
  from: number;
  to: number;
  yearGraduated: number;
  awards: string;
  _id?: string;
  employeeId: string;
  degree: string;
  units?: string;


*/
