import { Test, TestingModule } from '@nestjs/testing';
import { UpdateService } from './update.service';

describe('WriteToDbService', () => {
  let service: UpdateService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateService],
    }).compile();
    service = module.get<UpdateService>(UpdateService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
