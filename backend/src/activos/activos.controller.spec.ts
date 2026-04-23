import { Test, TestingModule } from '@nestjs/testing';
import { ActivosController } from './activos.controller';
import { ActivosService } from './activos.service';

describe('ActivosController', () => {
  let controller: ActivosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivosController],
      providers: [ActivosService],
    }).compile();

    controller = module.get<ActivosController>(ActivosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
