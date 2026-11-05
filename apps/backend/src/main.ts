import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { env } from './config/env';

async function bootstrap() {
  const e = env(); // fails fast with a readable message if the server .env is incomplete
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  app.useBodyParser('json', { limit: '2mb' });
  app.setGlobalPrefix(e.API_PREFIX); // static files under /uploads are served by Express directly
  app.enableCors({ origin: e.CORS_ORIGINS.split(',').map((s) => s.trim()), credentials: true });
  app.useStaticAssets(require('node:path').resolve(e.UPLOAD_DIR), { prefix: '/uploads/' });
  app.set('trust proxy', 1);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.enableShutdownHooks();

  await app.listen(e.PORT, '0.0.0.0');
  Logger.log(`API running on port ${e.PORT} (prefix /${e.API_PREFIX})`, 'Bootstrap');
}

void bootstrap();
