import { Test, TestingModule } from '@nestjs/testing';
import { SignupRequestController } from './signup-request.controller';

describe('SignupRequestController', () => {
  let controller: SignupRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupRequestController],
    }).compile();

    controller = module.get<SignupRequestController>(SignupRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
