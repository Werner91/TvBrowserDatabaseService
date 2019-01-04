import { Injectable} from '@nestjs/common';
import { EpgDataDTO } from '../update/DTOs/epgDataDTO';
import { EpgDataEntity } from '../entitys/epgData.entity';
import { ChannelsEntity } from '../entitys/channels.entity' 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, IsNull} from 'typeorm';
import { ChannelsDTO } from 'src/update/DTOs/channelsDTO';
import { API } from 'src/constants/api.constants';

@Injectable()
export class DbHelperService {

    constructor(
        @InjectRepository(EpgDataEntity) private readonly epgDataRepository: Repository<EpgDataEntity>, 
        @InjectRepository(ChannelsEntity) private readonly channelsRepository: Repository<ChannelsEntity>, 
    ){}

    async getImagesToDelete(timestamp: number){
        const data = await this.epgDataRepository
                                .query(`
                                    SELECT images FROM (
                                        SELECT images, MIN(begin_timestamp_UTC) as begin_timestamp_UTC
                                        FROM epg_data
                                        GROUP BY images
                                        HAVING COUNT(images) = 1) AS InnerTable
                                    WHERE begin_timestamp_UTC < '${timestamp}' AND images != '${API.DEFAULT_IMAGE}' AND images IS NOT NULL ;
                                `);
        return data;
    }

    async clearOldEPGData(begin_ts: number){
        const data = await this.epgDataRepository
                                .createQueryBuilder()
                                .delete()
                                .where("begin_timestamp_UTC < :begin_timestamp_UTC", {begin_timestamp_UTC: begin_ts})
                                .execute();
        return {delete: true, data: data};
    }

    async writeNewEPG(epgData: EpgDataDTO[]): Promise<EpgDataEntity[]>{
        const data = await this.epgDataRepository.create(epgData);
        const response = await this.epgDataRepository.save(data);
        return response;
    }

    async getAllTvShowsWithoutImages(){
        const data = await this.epgDataRepository
                                .createQueryBuilder()
                                .select('DISTINCT(`title`)')
                                .where({ images: IsNull(), 
                                         duration_sec: LessThan(3600)
                                })
                                .take(42)
                                .getRawMany()
        return data;
    }

    async getAllMoviesWithoutImages(): Promise<EpgDataEntity[]>{
        const data = await this.epgDataRepository
                                .createQueryBuilder()
                                .select('DISTINCT(`title`)')
                                .where({ images: IsNull(), 
                                        duration_sec: MoreThan(3599)
                                })
                                .take(42)
                                .getRawMany()
        return data;
    }

    async updateImageNames(imageName: string, titleName: string){
        const data = await this.epgDataRepository
                                .createQueryBuilder()
                                .update()
                                .set({images: imageName})
                                .where("title = :title", {title: titleName})
                                .execute();
    }

    async writeChannels(channels: ChannelsDTO[]){
        const data = await this.channelsRepository.create(channels);
        const response = await this.channelsRepository.save(data);
        return response;
    }
}
