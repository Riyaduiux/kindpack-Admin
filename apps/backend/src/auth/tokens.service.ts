import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { env } from '../config/env';

const sha = (s: string) => createHash('sha256').update(s).digest('hex');

function ttlSeconds(ttl: string) {
  const m = /^(\d+)([smhd])$/.exec(ttl);
  if (!m) return 900;
  return Number(m[1]) * { s: 1, m: 60, h: 3600, d: 86400 }[m[2] as 's' | 'm' | 'h' | 'd'];
}

@Injectable()
export class TokensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** Issues an access token (JWT) and a rotating refresh token for one role. */
  async issue(user: { id: string; name: string }, role: string, deviceId?: string) {
    const expiresIn = ttlSeconds(env().JWT_ACCESS_TTL);
    const accessToken = await this.jwt.signAsync({ sub: user.id, role, name: user.name }, { expiresIn });
    const refreshToken = `rt_${randomBytes(24).toString('hex')}`;
    await this.prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: sha(refreshToken), role, deviceId, expiresAt: new Date(Date.now() + env().JWT_REFRESH_TTL_DAYS * 864e5) },
    });
    return { accessToken, refreshToken, tokenType: 'Bearer', expiresIn };
  }

  /** Swaps a refresh token for a new pair (the old one is revoked). */
  async rotate(refreshToken: string) {
    const row = await this.prisma.refreshToken.findUnique({ where: { tokenHash: sha(refreshToken) }, include: { user: true } });
    if (!row || row.revokedAt || row.expiresAt < new Date() || row.user.deletedAt || row.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }
    await this.prisma.refreshToken.update({ where: { id: row.id }, data: { revokedAt: new Date() } });
    return { user: row.user, role: row.role, tokens: await this.issue(row.user, row.role, row.deviceId ?? undefined) };
  }

  async revoke(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({ where: { tokenHash: sha(refreshToken), revokedAt: null }, data: { revokedAt: new Date() } });
  }

  async revokeAll(userId: string) {
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }
}
