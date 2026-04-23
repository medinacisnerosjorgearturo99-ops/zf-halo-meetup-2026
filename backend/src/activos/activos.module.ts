import { Module } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { ActivosController } from './activos.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Importar esto

@Module({
  imports: [PrismaModule], // <-- Agregarlo aquí
  controllers: [ActivosController],
  providers: [ActivosService],
})
export class ActivosModule {}