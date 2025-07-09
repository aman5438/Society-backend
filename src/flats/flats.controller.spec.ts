import { Test, TestingModule } from '@nestjs/testing';
import { FlatsController } from './flats.controller';
import { FlatsService } from './flats.service';

describe('FlatsController', () => {
  let controller: FlatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlatsController],
      providers: [
        {
          provide: FlatsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FlatsController>(FlatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
