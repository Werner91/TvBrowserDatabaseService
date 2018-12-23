import { Module } from '@nestjs/common';
import { DbHelperService } from './db-helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpgDataEntity } from '../entitys/epgData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EpgDataEntity])
  ],
  providers: [DbHelperService],
  exports: [DbHelperService]
})
export class DbHelperModule {}
