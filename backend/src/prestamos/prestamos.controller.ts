import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post('solicitar')
  create(@Body() data: any) {
    return this.prestamosService.solicitarPrestamo(data);
  }

  // Ruta dinámica que recibe el ID del préstamo en la URL
  @Post(':id/aprobar')
  aprobar(@Param('id') id: string, @Body() data: any) {
    return this.prestamosService.aprobarPrestamo(id, data);
  }

  @Post(':id/devolver')
  devolver(@Param('id') id: string) {
    return this.prestamosService.devolverPrestamo(id);
  }

  @Get()
  findAll() {
    return this.prestamosService.findAll();
  }
}