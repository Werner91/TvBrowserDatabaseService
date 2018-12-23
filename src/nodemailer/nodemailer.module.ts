import { Module } from '@nestjs/common';
import { NodeMailerService } from './nodemailer.service';
import { CurrentDateTimeModule } from 'src/current-date-time/current-date-time.module';

@Module({
  imports: [CurrentDateTimeModule],
  providers: [NodeMailerService],
  exports: [NodeMailerService]
})
export class NodeMailerModule {}
