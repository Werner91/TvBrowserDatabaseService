import { Injectable, Inject } from '@nestjs/common';
import * as Cron from 'cron';
import { Logger } from 'winston';
import { CurrentDateTimeService } from '../current-date-time/current-date-time.service';
import { NodeMailerService } from '../nodemailer/nodemailer.service';
import { UpdateService } from '../update/update.service';

@Injectable()
export class CronJobService {

    constructor(
        @Inject('winston') private readonly winstonLogger: Logger,
        private readonly currentDateTimeService: CurrentDateTimeService, 
        private readonly nodeMailerService: NodeMailerService,
        private readonly updateService: UpdateService
    ){
        this.startCronJob();
    }

    startCronJob(){
        try {
            new Cron.CronJob({
                cronTime: '00 06 00 * * *', //executed very day at 06:00
                onTick: () => {
                    this.updateService.runUpdate();
                },
                start: true, //start the job right now
                timeZone: 'Europe/Berlin'
            });
        } catch (error) {
            this.errorHandling(error);
        }
    };

    errorHandling(error: string){
        this.winstonLogger.log('error', this.currentDateTimeService.getCurrentDateTime().toString() + ' | ' + CronJobService.name + ' | ' + error);
        this.nodeMailerService.sendMail(' | ' + CronJobService.name + ' | ' + error);
    }
}
