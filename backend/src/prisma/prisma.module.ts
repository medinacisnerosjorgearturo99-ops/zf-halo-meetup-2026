import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto hace que Prisma esté disponible en toda la API sin tener que importarlo a cada rato
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}