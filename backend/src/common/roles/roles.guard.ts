import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesPermitidos = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Si la ruta no pide un rol específico, la dejamos pasar (ruta pública)
    if (!rolesPermitidos) return true; 

    const request = context.switchToHttp().getRequest();
    // Leemos el ID del usuario simulando que viene en un token de seguridad
    const userId = request.headers['x-user-id']; 

    if (!userId) {
      throw new UnauthorizedException('Acceso denegado: Falta el header x-user-id con tu ID de usuario.');
    }

    // Buscamos al usuario en SQL Server junto con el nombre de su rol
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { rol: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Acceso denegado: Usuario no encontrado en el sistema.');
    }

    // Comprobamos si el nombre de su rol está en la lista VIP
    const tienePermiso = rolesPermitidos.includes(usuario.rol.nombre);
    if (!tienePermiso) {
      throw new ForbiddenException(`Operación rechazada. Solo los roles: [${rolesPermitidos.join(', ')}] pueden hacer esto.`);
    }

    return true; // ¡Pasa el guardia!
  }
}