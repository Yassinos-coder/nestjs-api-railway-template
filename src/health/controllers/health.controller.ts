import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipShield } from 'nestjs-shield';
import { HealthService } from '../services/health.service';
import { HealthStatus } from '../interfaces/health-status.interface';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @SkipShield()
  check(): Promise<HealthStatus> {
    return this.healthService.check();
  }
}
