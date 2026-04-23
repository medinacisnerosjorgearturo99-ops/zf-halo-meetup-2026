import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ActivosService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo activo
  async create(data: any) {
    const qrHash = `ZF-QR-${uuidv4()}`;

    return this.prisma.activo.create({
      data: {
        identificador: data.identificador,
        qr_code_hash: qrHash,
        nombre_maquina: data.nombre_maquina,
        tag: data.tag,
        numero_serie: data.numero_serie,
        numero_parte: data.numero_parte,
        modelo: data.modelo,
        descripcion: data.descripcion,
        estado: data.estado || 'Disponible',
        categoria_id: data.categoria_id,
        ubicacion_id: data.ubicacion_id,
        marca_id: data.marca_id,
        proyecto_id: data.proyecto_id,
        anio: data.anio,
        pedimento: data.pedimento,
        factura: data.factura,
        valor_comercial: data.valor_comercial,
        fecha_compra: data.fecha_compra ? new Date(data.fecha_compra) : null,
        comentarios: data.comentarios,
        tipo_compra: data.tipo_compra,
        tipo_nacional: data.tipo_nacional,
        compra: data.compra,
      },
    });
  }

  // Obtener todos los activos (Catálogo)
  async findAll() {
    return this.prisma.activo.findMany({
      include: {
        categoria: true,
        ubicacion: true,
        marca: true,
        proyecto: true
      },
    });
  }

  // Obtener un activo por su QR
  async findByQr(qrCodeHash: string) {
    return this.prisma.activo.findUnique({
      where: { qr_code_hash: qrCodeHash },
      include: { 
        categoria: true, 
        ubicacion: true,
        marca: true,
        proyecto: true
      },
    });
  }
}