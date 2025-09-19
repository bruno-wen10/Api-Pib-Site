import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler()) || [];

    if (!requiredPermissions.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Usuário não autenticado');

    const hasAccess = requiredPermissions.every(
      (perm) => user.permissions?.[perm] === true,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Acesso negado 🚫');
    }

    return true;
  }
}
