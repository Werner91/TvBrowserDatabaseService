import { Module } from '@nestjs/common';
import { CurrentDateTimeService } from './current-date-time.service';

@Module({
  providers: [CurrentDateTimeService],
  exports: [CurrentDateTimeService]
})
export class CurrentDateTimeModule {}
