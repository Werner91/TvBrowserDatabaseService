import { Injectable, Inject } from '@nestjs/common';
import * as Cron from 'cron';
import { Logger } from 'winston';
import { CurrentDateTimeService } from '../current-date-time/current-date-time.service';
import { NodeMailerService } from '../nodemailer/nodemailer.service';
import { UpdateService } from '../update/update.service';
import { API } from '../constants/api.constants';

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
                //cronTime: '*/2 * * * * *', //executed every second minute
                cronTime: '00 06 00 * * *', //executed very day at 06:00am
                onTick: () => {
                    this.updateService.getTokenForTvDB()
                            .subscribe(async(resp) => {
                                if(resp.status == 200){
                                    API.TVDB_TOKEN = resp.data.token;
                                    this.updateService.runUpdate();
                                }
                            });
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
