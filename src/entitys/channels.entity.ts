import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('channels')
export class ChannelsEntity {

  @PrimaryColumn({type: "varchar"})
  servicereference: string;

  @Column({type: "text", nullable: true})
  servicename: string; 

  @Column({type: "int", nullable: true})
  program: number;

  @Column({type: "int", nullable: true})
  pos: number;
}