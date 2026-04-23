import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrestamosService {
  constructor(private prisma: PrismaService) {}

  // 1. SOLICITAR
  async solicitarPrestamo(data: any) {
    const activo = await this.prisma.activo.findUnique({
      where: { identificador: data.activo_id },
    });

    if (!activo || activo.estado !== 'Disponible') {
      throw new BadRequestException('El activo no existe o no está disponible para préstamo.');
    }

    return this.prisma.$transaction(async (tx) => {
      const prestamo = await tx.prestamoSalida.create({
        data: {
          activo_id: data.activo_id,
          requisitor_id: data.requisitor_id,
          fecha_devolucion_esperada: new Date(data.fecha_devolucion_esperada),
          estado_flujo: 'Solicitado',
        },
      });

      await tx.activo.update({
        where: { identificador: data.activo_id },
        data: { estado: 'Prestado' },
      });

      return prestamo;
    });
  }

  // 2. APROBAR
  async aprobarPrestamo(id: string, data: any) {
    const prestamo = await this.prisma.prestamoSalida.findUnique({ where: { id } });
    
    if (!prestamo || prestamo.estado_flujo !== 'Solicitado') {
      throw new BadRequestException('El préstamo no existe o ya no está en estado Solicitado.');
    }

    return this.prisma.prestamoSalida.update({
      where: { id },
      data: {
        estado_flujo: 'Aprobado',
        aprobador_id: data.aprobador_id,
        fecha_salida: new Date(), // Registra la fecha y hora exacta en que se autorizó la salida
      },
    });
  }

  // 3. DEVOLVER (Cierra el ciclo y libera el activo)
  async devolverPrestamo(id: string) {
    const prestamo = await this.prisma.prestamoSalida.findUnique({ where: { id } });
    
    if (!prestamo || prestamo.estado_flujo !== 'Aprobado') {
      throw new BadRequestException('El préstamo no puede devolverse (quizás no ha sido aprobado o ya se devolvió).');
    }

    return this.prisma.$transaction(async (tx) => {
      // Marcamos el préstamo como devuelto
      const prestamoActualizado = await tx.prestamoSalida.update({
        where: { id },
        data: {
          estado_flujo: 'Devuelto',
          fecha_devolucion_real: new Date(),
        },
      });

      // ¡Importante! Liberamos el activo para que alguien más lo pueda pedir
      await tx.activo.update({
        where: { identificador: prestamo.activo_id },
        data: { estado: 'Disponible' },
      });

      return prestamoActualizado;
    });
  }

  // CATÁLOGO DE PRÉSTAMOS
  async findAll() {
    return this.prisma.prestamoSalida.findMany({
      include: {
        activo: true,
        requisitor: true,
        aprobador: true,
      },
    });
  }
}