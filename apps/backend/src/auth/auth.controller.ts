import { Body, Controller, Get, HttpCode, Ip, Post } from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { CurrentUser, Public, type AuthUser } from './auth.decorators';
import { ZodPipe } from '../common/zod.pipe';
import { ok } from '../common/http';

const LoginBody = z.object({ email: z.string().email(), password: z.string().min(1) });
const RefreshBody = z.object({ refreshToken: z.string().min(1) });
const PasswordBody = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8, 'Use at least 8 characters') });

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body(new ZodPipe(LoginBody)) body: z.infer<typeof LoginBody>, @Ip() ip: string) {
    return ok(await this.auth.login(body.email, body.password, ip), 'Logged in');
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body(new ZodPipe(RefreshBody)) body: z.infer<typeof RefreshBody>) {
    return ok(await this.auth.refresh(body.refreshToken), 'Token refreshed');
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  async logout(@Body(new ZodPipe(RefreshBody)) body: z.infer<typeof RefreshBody>) {
    await this.auth.logout(body.refreshToken);
    return ok(null, 'Logged out');
  }

  @Get('me')
  async me(@CurrentUser() u: AuthUser) {
    return ok(await this.auth.me(u.userId));
  }

  @Post('password')
  @HttpCode(200)
  async changePassword(@CurrentUser() u: AuthUser, @Body(new ZodPipe(PasswordBody)) body: z.infer<typeof PasswordBody>) {
    await this.auth.changePassword(u.userId, body.currentPassword, body.newPassword);
    return ok(null, 'Password changed. Please log in again.');
  }
}
