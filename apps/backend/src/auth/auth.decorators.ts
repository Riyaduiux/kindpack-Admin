import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';
export const ROLES = 'roles';

/** Route needs no token. */
export const Public = () => SetMetadata(IS_PUBLIC, true);

/** Route/controller only for these active roles. */
export const Roles = (...roles: string[]) => SetMetadata(ROLES, roles);

export interface AuthUser {
  userId: string;
  role: string;
  name: string;
}

/** The signed-in user ({ userId, role, name }). */
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user);
