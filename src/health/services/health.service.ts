import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseRepository } from '../../database/repositories/database.repository';
import { HealthStatus } from '../interfaces/health-status.interface';

@Injectable()
export class HealthService {
  constructor(private readonly databaseRepository: DatabaseRepository) {}

  async check(): Promise<HealthStatus> {
    const databaseEnabled = this.databaseRepository.isEnabled();

    if (databaseEnabled && !(await this.databaseRepository.ping())) {
      throw new ServiceUnavailableException('Database is unreachable');
    }

    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      database: databaseEnabled ? 'up' : 'disabled',
    };
  }
}
