import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstadisticasService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    // 1. Total de activos registrados
    const totalActivos = await this.prisma.activo.count();

    // 2. Agrupar cuántos activos hay por cada estado (Disponible, Prestado, impairment)
    const activosPorEstado = await this.prisma.activo.groupBy({
      by: ['estado'],
      _count: { estado: true },
    });

    // 3. Contar cuántos préstamos están "vivos" (no devueltos)
    const prestamosActivos = await this.prisma.prestamoSalida.count({
      where: {
        estado_flujo: {
          in: ['Solicitado', 'Aprobado'],
        },
      },
    });

    // Formatear la respuesta para que el Frontend la consuma facilísimo
    return {
      kpis: {
        total_activos: totalActivos,
        prestamos_en_curso: prestamosActivos,
      },
      grafica_estados: activosPorEstado.map(item => ({
        estado: item.estado,
        cantidad: item._count.estado,
      })),
    };
  }
}