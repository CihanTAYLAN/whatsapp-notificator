import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LanguageExamModule } from './cron/languageExam.module';
import { BasicAuthGuard } from './cron/basic-auth.guard';

@Module({
  imports: [LanguageExamModule],
  controllers: [AppController],
  providers: [BasicAuthGuard],
})
export class AppModule {}
