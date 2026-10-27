import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseRepository } from '../../database/repositories/database.repository';
import { User } from '../interfaces/user.interface';

const USER_COLUMNS = 'id, email, password_hash AS "passwordHash", created_at AS "createdAt"';
const UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersRepository implements OnModuleInit {
  constructor(private readonly database: DatabaseRepository) {}

  async onModuleInit(): Promise<void> {
    if (!this.database.isEnabled()) return;

    await this.database.query(
      `CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text UNIQUE NOT NULL,
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.database.query<User>(
      `SELECT ${USER_COLUMNS} FROM users WHERE email = $1`,
      [email],
    );
    return rows[0] ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.database.query<User>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async create(email: string, passwordHash: string): Promise<User> {
    try {
      const rows = await this.database.query<User>(
        `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING ${USER_COLUMNS}`,
        [email, passwordHash],
      );
      return rows[0];
    } catch (error) {
      if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
  }
}
