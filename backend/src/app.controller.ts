import { Controller, Get, Post, Patch, Param, Body, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: any) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: body.email },
    });
    if (!usuario || usuario.password !== body.password) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    return usuario;
  }

  @Get('activos')
  async getActivos() {
    return this.prisma.activo.findMany();
  }

  @Get('categorias')
  async getCategorias() {
    return this.prisma.categoria.findMany();
  }

  @Get('ubicaciones')
  async getUbicaciones() {
    return this.prisma.ubicacion.findMany();
  }

  @Post('activos')
  async crearActivo(@Body() body: any) {
    return this.prisma.activo.create({
      data: body,
    });
  }

  @Patch('activos/:identificador/estado')
  async actualizarEstadoActivo(
    @Param('identificador') identificador: string,
    @Body() body: { estado: string }
  ) {
    return this.prisma.activo.update({
      where: { identificador: identificador },
      data: { estado: body.estado },
    });
  }
}