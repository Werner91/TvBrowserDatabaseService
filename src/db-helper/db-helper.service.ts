import { Injectable, HttpService} from '@nestjs/common';
import { EpgDataDTO } from '../update/DTOs/epgDataDTO';
import { EpgDataEntity } from '../entitys/epgData.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DbHelperService {

    constructor(@InjectRepository(EpgDataEntity) private readonly epgDataRepository: Repository<EpgDataEntity>){}

    async clearOldData(begin_timestamp: number){
        const data = await this.epgDataRepository
                                .createQueryBuilder()
                                .delete()
                                .where("begin_timestamp <= begin_timestamp", {begin_timestamp})
                                .execute();
        return {delete: true, data: data};
    }

    async writeToDatabase(epgData: EpgDataDTO[]){
        const data = await this.epgDataRepository.create(epgData);
        await this.epgDataRepository.save(data);
        return data;
    }
}
