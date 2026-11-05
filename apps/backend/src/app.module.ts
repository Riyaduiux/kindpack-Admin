import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.service';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { UploadsModule } from './modules/uploads/uploads.controller';
import { UsersModule } from './modules/users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    PrismaModule,
    CoreModule,
    AuthModule,
    UploadsModule,
    UsersModule,
    // Register new feature modules here.
  ],
  controllers: [HealthController],
})
export class AppModule {}
