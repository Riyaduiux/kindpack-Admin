import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from './tokens.service';
import { AuditService } from '../core/audit.service';
import { iso, notFound } from '../common/http';

type UserRow = { id: string; email: string; name: string; role: string; status: string; avatarUrl: string | null; createdAt: Date; lastActiveAt: Date | null };

/** Public shape of a user returned by the API. */
export const toUser = (u: UserRow) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  status: u.status,
  avatarUrl: u.avatarUrl,
  lastActiveAt: iso(u.lastActiveAt),
  createdAt: iso(u.createdAt),
});

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
    private readonly audit: AuditService,
  ) {}

  async login(email: string, password: string, ip = '') {
    const user = await this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    const valid = !!user?.passwordHash && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !valid || user.deletedAt) throw new UnauthorizedException('Email or password is incorrect');
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('This account is not active');

    const updated = await this.prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
    await this.audit.log(user.name, 'LOGIN', 'auth', user.email, undefined, undefined, ip);
    return { user: toUser(updated), tokens: await this.tokens.issue(user, user.role) };
  }

  async refresh(refreshToken: string) {
    const { user, tokens } = await this.tokens.rotate(refreshToken);
    return { user: toUser(user), tokens };
  }

  logout(refreshToken: string) {
    return this.tokens.revoke(refreshToken);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) throw notFound('User');
    return toUser(user);
  }

  async changePassword(userId: string, current: string, next: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash || !(await bcrypt.compare(current, user.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(next, 10) } });
    await this.tokens.revokeAll(userId);
  }
}
