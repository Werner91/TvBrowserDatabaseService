import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [],
    }).compile();
  });

  describe('root', () => {});
});
