import { Test, TestingModule } from '@nestjs/testing';
import { ActivosService } from './activos.service';

describe('ActivosService', () => {
  let service: ActivosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivosService],
    }).compile();

    service = module.get<ActivosService>(ActivosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
