import { Module } from '@nestjs/common';
import { UpdateModule } from './update/update.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm'
import { DbHelperModule } from './db-helper/db-helper.module';
import { WinstonModule } from 'nest-winston';
import { CurrentDateTimeModule } from './current-date-time/current-date-time.module';
import { NodeMailerModule } from './nodemailer/nodemailer.module';
import * as Winston from 'winston';

@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    UpdateModule, 
    DbHelperModule,
    WinstonModule.forRoot({
      level: 'error',
      format:  Winston.format.combine(
         Winston.format.timestamp(),
         Winston.format.printf(error => {
            return `${error.timestamp} ${error.level}: ${error.message}`;
        })
    ),
    transports: [new Winston.transports.File({ filename: 'errorlog_database_service.log' })]
    }),
    CurrentDateTimeModule,
    NodeMailerModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
