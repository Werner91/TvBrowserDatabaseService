import { Injectable, Inject} from '@nestjs/common';
import * as Nodemailer from 'nodemailer';
import { NodeMailerSettings } from '../constants/nodemailer.constants';
import { CurrentDateTimeService } from '../current-date-time/current-date-time.service';
import { Logger } from 'winston';

@Injectable()
export class NodeMailerService {

    transporter;

    constructor(@Inject('winston') private readonly winstonLogger: Logger, private readonly currentDateTimeService: CurrentDateTimeService){
        this.transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: NodeMailerSettings.MAIL_FROM,
              pass: NodeMailerSettings.MAIL_FROM_PW
            }
          });
    }

    sendMail(errorMessage: string){
        let mailOptions = {
            from: NodeMailerSettings.MAIL_FROM,
            to: NodeMailerSettings.MAIL_TO,
            subject: 'Error in Update Service',
            text: this.currentDateTimeService.getCurrentDateTime() + ' ' + errorMessage,
          };

          this.transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return this.winstonLogger.log('error', this.currentDateTimeService.getCurrentDateTime() + ' | ' + error);
            }
            console.log('Email sent: ' + info.response);
        })
    }
}
