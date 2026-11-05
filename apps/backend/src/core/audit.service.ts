import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Append-only trail of sensitive actions (who did what, when and from where). */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(user: string, action: string, module: string, record: string, before = '—', after = '—', ip = '') {
    return this.prisma.auditLog.create({ data: { user, action, module, record, before, after, ip } });
  }
}
