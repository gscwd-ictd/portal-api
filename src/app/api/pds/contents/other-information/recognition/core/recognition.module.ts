import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recognition } from '../data/recognition.entity';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recognition])],
  controllers: [RecognitionController],
  providers: [RecognitionService],
  exports: [RecognitionService],
})
export class RecognitionModule {}
