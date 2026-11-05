import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC, ROLES, AuthUser } from './auth.decorators';

/** Global guard: verifies the bearer token and the role required by @Roles(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const targets = [ctx.getHandler(), ctx.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, targets);
    const req = ctx.switchToHttp().getRequest();
    const header: string = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (token) {
      try {
        const payload = await this.jwt.verifyAsync<{ sub: string; role: string; name: string }>(token);
        req.user = { userId: payload.sub, role: payload.role, name: payload.name } satisfies AuthUser;
      } catch {
        if (!isPublic) throw new UnauthorizedException('Unauthorized: access token is missing or expired');
      }
    }
    if (isPublic) return true;
    if (!req.user) throw new UnauthorizedException('Unauthorized: access token is missing or expired');

    const roles = this.reflector.getAllAndOverride<string[]>(ROLES, targets);
    if (roles?.length && !roles.includes(req.user.role)) {
      throw new ForbiddenException('You are not allowed to use this endpoint');
    }
    return true;
  }
}
