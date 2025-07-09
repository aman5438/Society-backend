import { Test, TestingModule } from '@nestjs/testing';
import { SignupRequestService } from './signup-request.service';

describe('SignupRequestService', () => {
  let service: SignupRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupRequestService],
    }).compile();

    service = module.get<SignupRequestService>(SignupRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
