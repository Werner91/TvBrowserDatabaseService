import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('epg_data')
export class EpgDataEntity {

  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('text')
  sname: string;

  @Column('text')
  title: string;

  @Column('int')
  begin_timestamp: number;

  @Column('text')
  begin_timestamp_formated: string;

  @Column('int')
  now_timestamp: number;

  @Column('text')
  sref: string;

  @Column('int')
  id: number;

  @Column('int')
  duration_sec: number;

  @Column('text')
  shortdesc: string;

  @Column('text')
  longdesc: string;
}