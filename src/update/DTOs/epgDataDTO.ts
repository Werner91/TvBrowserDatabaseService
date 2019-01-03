export interface EpgDataDTO{
  sname: string;
  title: string;
  begin_timestamp_UTC: number;
  begin_timestamp_formated_UTC: string;
  begin_timestamp_formated: string;
  sref: string;
  id: number;
  duration_sec: number;
  shortdesc: string;
  longdesc: string;
}