import { Module } from '@nestjs/common';
import { LanguageExamService } from './languageExam.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ExamController } from './languageExam.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ExamController],
  providers: [LanguageExamService],
})
export class LanguageExamModule {}
