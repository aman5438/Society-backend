import { Test, TestingModule } from '@nestjs/testing';
import { SocietyController } from './society.controller';

describe('SocietyController', () => {
  let controller: SocietyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocietyController],
    }).compile();

    controller = module.get<SocietyController>(SocietyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
