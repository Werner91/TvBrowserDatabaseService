import { Injectable, HttpService, Inject } from '@nestjs/common';
import { API } from '../constants/api.constants';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { EpgDataDTO } from './DTOs/epgDataDTO';
import { DbHelperService } from 'src/db-helper/db-helper.service';
import { Logger } from 'winston';
import { CurrentDateTimeService } from '../current-date-time/current-date-time.service';
import { NodeMailerService } from '../nodemailer/nodemailer.service';
import { ChannelsDTO } from './DTOs/channelsDTO';

@Injectable()
export class UpdateService {

    constructor(
        @Inject('winston') private readonly winstonLogger: Logger, 
        private readonly httpService: HttpService, 
        private readonly dbHelper: DbHelperService,
        private readonly currentDateTimeService: CurrentDateTimeService,
        private readonly nodeMailerService: NodeMailerService
    ){}

    runUpdate() {
        this.getEpgData().subscribe( async(epgData) => {
            if(epgData.status == 200){
                //set values to save in database
                var epgDataList: EpgDataDTO[] = [];
                epgData.data.events.forEach(element => {
                    let epgDataDTO: EpgDataDTO = this.setEpgData(element);
                    epgDataList.push(epgDataDTO);
                });
                try{
                    //write new epg data to server
                    console.log("Start writing to database ....", 'update.service');
                    await this.dbHelper.writeNewEPG(epgDataList)
                    console.log("Finished writing to database", 'update.service');

                    //delete all data which begin_timestamp is older than today
                    const date = new Date();
                    const begin_timestamp = Math.round((new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +'T00:00Z')).getTime() / 1000);
                    console.log("Start deleting old data from database ....", 'update.service');
                    await this.dbHelper.clearOldEPGdData(begin_timestamp);
                    console.log("Finished deleting old data from database", 'update.service');
                } catch(error){
                    this.errorHandling(error);
                }
            }
        })

        this.getChannels().subscribe( async(channels) => {
            if(channels.status == 200){
                var channelsList: ChannelsDTO[] = [];
                channels.data.services.forEach(element => {
                    let channelsDTO: ChannelsDTO = this.setChannels(element);
                    channelsList.push(channelsDTO);
                });
                try {
                    await this.dbHelper.writeChannels(channelsList);
                } catch (error) {
                    this.errorHandling(error);
                }
            }
        })
    }

    getEpgData(): Observable<AxiosResponse>{
        try{
            return this.httpService.get(API.MUTANT_IPADRESS + API.API + API.MULTIEPG + API.URL_ENCODED_BOUQUET);
        } catch(error){
            this.errorHandling(error);
        }
    }

    getChannels(): Observable<AxiosResponse>{
        try {
            return this.httpService.get(API.MUTANT_IPADRESS + API.API + API.CHANNELS + API.URL_ENCODED_BOUQUET);
        } catch (error) {
            this.errorHandling(error);
        }
    }

    setEpgData(element: any): EpgDataDTO{
        let epgDataItem: EpgDataDTO = {
            sname: element.sname,
            title: element.title,
            begin_timestamp: element.begin_timestamp,
            begin_timestamp_formated: new Date(element.begin_timestamp * 1000).toISOString(),
            now_timestamp: element.now_timestamp,
            sref: element.sref,
            id: element.id,
            duration_sec: element.duration_sec,
            shortdesc: element.shortdesc,
            longdesc: element.longdesc,
        }
        return epgDataItem;
    }

    setChannels(element: any): ChannelsDTO{
        let channelsItem: ChannelsDTO = {
            servicereference: element.servicereference,
            program: element.program,
            servicename: element.servicename,
            pos: element.pos,
        }
        return channelsItem;
    }

    errorHandling(error: string){
        this.winstonLogger.log('error', this.currentDateTimeService.getCurrentDateTime().toString() + ' | ' + UpdateService.name + ' | ' + error);
        this.nodeMailerService.sendMail(' | ' + UpdateService.name + ' | ' + error);
    }
}
