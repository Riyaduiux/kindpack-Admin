import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/auth.decorators';

@Public()
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { service: 'api', status: 'ok', time: new Date().toISOString() };
  }
}
