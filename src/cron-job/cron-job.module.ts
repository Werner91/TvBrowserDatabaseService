import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { NodeMailerModule } from '../nodemailer/nodemailer.module';
import { CurrentDateTimeModule } from '../current-date-time/current-date-time.module';
import { UpdateModule } from 'src/update/update.module';

@Module({
  imports: [
    NodeMailerModule,
    CurrentDateTimeModule,
    UpdateModule
  ],
  providers: [CronJobService],
  exports: [CronJobService],
})
export class CronJobModule {}
