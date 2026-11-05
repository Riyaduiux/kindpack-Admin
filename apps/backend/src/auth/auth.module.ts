import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensService } from './tokens.service';
import { AuthGuard } from './auth.guard';
import { env } from '../config/env';

@Global()
@Module({
  imports: [JwtModule.registerAsync({ global: true, useFactory: () => ({ secret: env().JWT_ACCESS_SECRET }) })],
  controllers: [AuthController],
  providers: [AuthService, TokensService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [AuthService, TokensService],
})
export class AuthModule {}
