import { Module, HttpModule } from '@nestjs/common';
import { UpdateService } from './update.service';
import { DbHelperModule } from 'src/db-helper/db-helper.module';
import { NodeMailerModule } from 'src/nodemailer/nodemailer.module';

@Module({
  imports: [
    HttpModule, 
    DbHelperModule, 
    NodeMailerModule
  ],
  providers: [UpdateService],
  exports: [UpdateService],
})
export class UpdateModule {}