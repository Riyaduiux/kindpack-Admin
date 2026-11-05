import { Body, Controller, Get, Module, Param, Patch, Post, Query } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../core/audit.service';
import { CurrentUser, Roles, type AuthUser } from '../../auth/auth.decorators';
import { toUser } from '../../auth/auth.service';
import { ZodPipe } from '../../common/zod.pipe';
import { notFound, ok, pageArgs, paged } from '../../common/http';

// Example module: admin-only user management. Copy this file as the starting point for new modules.

const CreateBody = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8, 'Use at least 8 characters'),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
});
const UpdateBody = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
});

@Roles('ADMIN')
@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  async list(@Query() q: Record<string, string>) {
    const p = pageArgs(q);
    const where = { deletedAt: null, ...(q.search ? { OR: [{ name: { contains: q.search } }, { email: { contains: q.search } }] } : {}) };
    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: p.skip, take: p.limit }),
      this.prisma.user.count({ where }),
    ]);
    return paged(rows.map(toUser), total, p);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const row = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!row) throw notFound('User');
    return ok(toUser(row));
  }

  @Post()
  async create(@CurrentUser() me: AuthUser, @Body(new ZodPipe(CreateBody)) body: z.infer<typeof CreateBody>) {
    const row = await this.prisma.user.create({
      data: { email: body.email.toLowerCase(), name: body.name, role: body.role, passwordHash: await bcrypt.hash(body.password, 10) },
    });
    await this.audit.log(me.name, 'CREATE', 'users', row.email);
    return ok(toUser(row), 'User created');
  }

  @Patch(':id')
  async update(@CurrentUser() me: AuthUser, @Param('id') id: string, @Body(new ZodPipe(UpdateBody)) body: z.infer<typeof UpdateBody>) {
    const before = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!before) throw notFound('User');
    const row = await this.prisma.user.update({ where: { id }, data: body });
    await this.audit.log(me.name, 'UPDATE', 'users', row.email, JSON.stringify({ name: before.name, role: before.role, status: before.status }), JSON.stringify(body));
    return ok(toUser(row), 'User updated');
  }
}

@Module({ controllers: [UsersController] })
export class UsersModule {}
