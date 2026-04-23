import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ActivosModule } from './activos/activos.module';
import { PrestamosModule } from './prestamos/prestamos.module'; // <-- Agrega esta línea
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [
    PrismaModule, 
    ActivosModule, 
    PrestamosModule, EstadisticasModule // <-- Y agrégalo aquí
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}