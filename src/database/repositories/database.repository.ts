import { Injectable, Logger, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseRepository implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseRepository.name);
  private readonly pool: Pool | null;

  constructor(config: ConfigService) {
    const url = config.get<string>('database.url') ?? '';
    const ssl = config.get<boolean>('database.ssl') ?? false;

    if (!url) {
      this.pool = null;
      this.logger.log('DATABASE_URL not set, database disabled');
      return;
    }

    this.pool = new Pool({
      connectionString: url,
      ssl: ssl ? { rejectUnauthorized: false } : undefined,
      max: 10,
      connectionTimeoutMillis: 5000,
    });
    this.pool.on('error', (error) => this.logger.error(`Idle client error: ${error.message}`));
  }

  isEnabled(): boolean {
    return this.pool !== null;
  }

  async query<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (!this.pool) throw new ServiceUnavailableException('Database is not configured');

    const result = await this.pool.query<T>(sql, params);
    return result.rows;
  }

  async ping(): Promise<boolean> {
    if (!this.pool) return false;

    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error(`Database ping failed: ${(error as Error).message}`);
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool?.end();
  }
}
