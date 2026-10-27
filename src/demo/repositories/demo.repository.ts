import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '../../database/repositories/database.repository';

@Injectable()
export class DemoRepository {
  constructor(private readonly database: DatabaseRepository) {}

  async getServerTime(): Promise<Date> {
    const rows = await this.database.query<{ now: Date }>('SELECT now() AS now');
    return rows[0].now;
  }
}
