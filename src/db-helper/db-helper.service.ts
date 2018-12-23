import { Injectable} from '@nestjs/common';
import { EpgDataDTO } from '../update/DTOs/epgDataDTO';
import { EpgDataEntity } from '../entitys/epgData.entity';
import { ChannelsEntity } from '../entitys/channels.entity' 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelsDTO } from 'src/update/DTOs/channelsDTO';

@Injectable()
export class DbHelperService {

    constructor(
        @InjectRepository(EpgDataEntity) private readonly epgDataRepository: Repository<EpgDataEntity>, 
        @InjectRepository(ChannelsEntity) private readonly channelsRepository: Repository<ChannelsEntity>, 
    ){}

    async clearOldEPGdData(begin_timestamp: number){
        const data = await this.epgDataRepository
                                .createQueryBuilder()
                                .delete()
                                .where("begin_timestamp < begin_timestamp", {begin_timestamp})
                                .execute();
        return {delete: true, data: data};
    }

    async writeNewEPG(epgData: EpgDataDTO[]){
        const data = await this.epgDataRepository.create(epgData);
        const response = await this.epgDataRepository.save(data);
        return response;
    }

    async writeChannels(channels: ChannelsDTO[]){
        const data = await this.channelsRepository.create(channels);
        const response = await this.channelsRepository.save(data);
        return response;
    }
}
