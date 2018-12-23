import { Test, TestingModule } from '@nestjs/testing';
import { DbHelperService } from './db-helper.service';

describe('DbHelperService', () => {
  let service: DbHelperService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbHelperService],
    }).compile();
    service = module.get<DbHelperService>(DbHelperService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
