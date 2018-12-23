import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrentDateTimeService {

    getCurrentDateTime(): string{
        const date = new Date();
        const currentDateTime = date.getDate() + '-' + 
                                (date.getMonth() + 1) + '-' + 
                                date.getFullYear() +  ' ' + 
                                date.getHours() + ':' + 
                                date.getMinutes() + ':' + 
                                date.getSeconds();
        return currentDateTime;
    }
}
