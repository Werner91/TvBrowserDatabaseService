import { Test, TestingModule } from '@nestjs/testing';
import { CurrentDateTimeService } from './current-date-time.service';

describe('CurrentDateTimeService', () => {
  let service: CurrentDateTimeService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentDateTimeService],
    }).compile();
    service = module.get<CurrentDateTimeService>(CurrentDateTimeService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
