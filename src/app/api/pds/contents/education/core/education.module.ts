import { Module } from '@nestjs/common';
import { CollegeModule } from '../parts/college/core/college.module';
import { ElementaryModule } from '../parts/elementary/core/elementary.module';
import { GraduateModule } from '../parts/graduate/core/graduate.module';
import { SecondaryModule } from '../parts/secondary/core/secondary.module';
import { VocationalModule } from '../parts/vocational/core/vocational.module';

@Module({
  imports: [ElementaryModule, VocationalModule, GraduateModule, SecondaryModule, CollegeModule],
  exports: [ElementaryModule, VocationalModule, GraduateModule, SecondaryModule, CollegeModule],
})
export class EducationModule {}
