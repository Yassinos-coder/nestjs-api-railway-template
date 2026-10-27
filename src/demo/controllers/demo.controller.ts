import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RateLimit } from 'nestjs-shield';
import { DemoService } from '../services/demo.service';
import { DemoResponse } from '../interfaces/demo-response.interface';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('rate-limit')
  @RateLimit({ limit: 5, ttl: 10_000 })
  getRateLimited(): DemoResponse {
    return this.demoService.getRateLimited();
  }
}
