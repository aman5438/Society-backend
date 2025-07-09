import { Test, TestingModule } from '@nestjs/testing';
import { FlatsService } from './flats.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('FlatsService', () => {
  let service: FlatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlatsService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FlatsService>(FlatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
