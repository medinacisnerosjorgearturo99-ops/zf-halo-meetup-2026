import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';

@Controller('activos')
export class ActivosController {
  constructor(private readonly activosService: ActivosService) {}

  @Post()
  @UseGuards(RolesGuard) // Activamos al guardia de seguridad
  @Roles('Administrador Patrimonial') // Exigimos este rol exacto
  create(@Body() createActivoDto: any) {
    return this.activosService.create(createActivoDto);
  }

  @Get()
  findAll() {
    return this.activosService.findAll();
  }

  @Get('qr/:hash')
  findByQr(@Param('hash') hash: string) {
    return this.activosService.findByQr(hash);
  }
}