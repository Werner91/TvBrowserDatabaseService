import { retryWhen, mergeMap, delay, take, catchError}  from 'rxjs/operators';
import { Injectable, HttpService, Inject } from '@nestjs/common';
import { API } from '../constants/api.constants';
import { Observable, of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { EpgDataDTO } from './DTOs/epgDataDTO';
import { DbHelperService } from 'src/db-helper/db-helper.service';
import { Logger } from 'winston';
import { CurrentDateTimeService } from '../current-date-time/current-date-time.service';
import { NodeMailerService } from '../nodemailer/nodemailer.service';
import { ChannelsDTO } from './DTOs/channelsDTO';
import { isBuffer } from 'util';


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
                    //delete all data which begin_timestamp is older than today
                    const date = new Date();
                    date.setHours(0,0,0,0);
                    const begin_timestamp = Math.round((new Date(date)).getTime() / 1000);
                    console.log("Start deleting old data from database ....", 'update.service');
                    await this.dbHelper.clearOldEPGData(begin_timestamp);
                    console.log("Finished deleting old data from database", 'update.service');

                    //write new epg data to server
                    console.log("Start writing to database ....", 'update.service');
                    await this.dbHelper.writeNewEPG(epgDataList)
                    console.log("Finished writing to database", 'update.service');

                    //set images to epgdata
                    // duration < 60min (tv shows)
                    const tvShowsWithoutImages = await this.getAllTvShowsWithoutImages();
                    this.imageController(tvShowsWithoutImages, 'tv');


                    /*
                    //duration > 60min (movies)
                    const moviesWithoutImages = await this.getAllMoviesWithoutImages();
                    this.imageController(tvShowsWithoutImages, 'movie');
                    */

                } catch(error){
                    this.errorHandling(error);
                }
            }
        });


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
        });
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

    getImagesFromMovieDB(title: string, showOrMovie: string): Observable<AxiosResponse>{
        try {
            /*
            https://api.themoviedb.org/3/movie/550?api_key=44449b26f9060de49b1cbe419e8409e2&language=de-DE&append_to_response=images&include_image_language=de,images
            https://image.tmdb.org/t/p/w300/2CMVaVmlsovUePAi3yMiqk2x2sP.jpg
            */
           //console.log('https://api.themoviedb.org/3/search/' + showOrMovie + '?api_key=44449b26f9060de49b1cbe419e8409e2&language=de-DE&query=' + encodeURIComponent(title) + '&page=1');
           return this.httpService.get('https://api.themoviedb.org/3/search/' + showOrMovie + '?api_key=44449b26f9060de49b1cbe419e8409e2&language=de-DE&query=' + encodeURIComponent(title) + '&page=1');
        } catch (error) {
            this.errorHandling(error);
        }
    }

    getAllTvShowsWithoutImages(){
        try {
            return this.dbHelper.getAllTvShowsWithoutImages();
        } catch (error) {
            this.errorHandling(error);
        }
    }

    getAllMoviesWithoutImages(){
        try {
            return this.dbHelper.getAllMoviesWithoutImages();
        } catch (error) {
            this.errorHandling(error);
        }
    }

    imageController(epgData: EpgDataDTO[], showOrMovie: string){
        var retryAfterMilliSeconds = 10000;
        epgData.forEach( (data) => {
            this.getImagesFromMovieDB(data.title, showOrMovie).pipe(
                retryWhen((error) => {
                    return error.pipe(
                        mergeMap((error: any) => {
                                /*
                                
                                    const retryAfter = error.response.headers;
                                    retryAfterMilliSeconds = +retryAfter['retry-after'] * 1000
                                    console.log(retryAfterMilliSeconds);
                                    console.log(data.title);
                                }else{
                                    
                                }
                                */
                                if(error.response.status !== 429) {
                                    this.errorHandling(error)
                                    return throwError(error);
                                }
                                console.log(data.title)
                                return of("error");
                            }),
                        delay(retryAfterMilliSeconds),
                        take(6)
                    )
            }))
            .subscribe( (res) => {
                console.log(res.status);
                console.log(res.headers);
            });
        })
    }

    setEpgData(element: any): EpgDataDTO{
        const date = new Date(element.begin_timestamp * 1000);
        const dateFormated = this.dateFormatter(date);
        let epgDataItem: EpgDataDTO = {
            sname: element.sname,
            title: element.title,
            begin_timestamp_UTC: element.begin_timestamp,
            begin_timestamp_formated_UTC: date.toISOString(),
            begin_timestamp_formated: dateFormated,
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

    dateFormatter(date: Date): string{
        const formatedDate = date.getFullYear() + '-' + 
                                ('0' + (date.getMonth() + 1)).slice(-2) + '-' + 
                                ('0' + date.getDate()).slice(-2) +  ' ' + 
                                ('0' + date.getHours()).slice(-2) + ':' + 
                                ('0' + date.getMinutes()).slice(-2) + ':' + 
                                ('0' + date.getSeconds()).slice(-2);
        return formatedDate;
    }

    errorHandling(error: string){
        this.winstonLogger.log('error', this.currentDateTimeService.getCurrentDateTime().toString() + ' | ' + UpdateService.name + ' | ' + error);
        this.nodeMailerService.sendMail(' | ' + UpdateService.name + ' | ' + error);
    }
}
