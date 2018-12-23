import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('epg_data')
export class EpgDataEntity {

  @PrimaryColumn({type: "int"})
  id: number;

  @Column({type: "text", nullable: true})
  sname: string;

  @Column({type: "text", nullable: true})
  title: string;

  @Column({type: "int", nullable: true})
  begin_timestamp: number;

  @Column({type: "text", nullable: true})
  begin_timestamp_formated: string;

  @Column({type: "int", nullable: true})
  now_timestamp: number;

  @Column({type: "text", nullable: true})
  sref: string;

  @Column({type: "int", nullable: true})
  duration_sec: number;

  @Column({type: "text", nullable: true})
  shortdesc: string;

  @Column({type: "text", nullable: true})
  longdesc: string;
}