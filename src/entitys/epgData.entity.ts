import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('epg_data')
export class EpgDataEntity {

  @Column({type: "int"})
  id: number;

  @PrimaryColumn({type: "int"})
  begin_timestamp_UTC: number;

  @PrimaryColumn({type: "varchar"})
  sref: string;

  @Column({type: "text", nullable: true})
  sname: string;

  @Column({type: "text", nullable: true})
  title: string;

  @Column({type: "text", nullable: true})
  begin_timestamp_formated_UTC: string;

  @Column({type: "text", nullable: true})
  begin_timestamp_formated: string;

  @Column({type: "int", nullable: true})
  duration_sec: number;

  @Column({type: "text", nullable: true})
  shortdesc: string;

  @Column({type: "text", nullable: true})
  longdesc: string;

  @Column({type: "text", nullable: true})
  images: string;
}