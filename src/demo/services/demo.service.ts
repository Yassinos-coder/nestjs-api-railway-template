import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateNoteDto } from '../dto/create-note.dto';
import { HashPasswordDto } from '../dto/hash-password.dto';
import {
  DatabaseTimeResponse,
  DemoResponse,
  NoteResponse,
  PasswordHashResponse,
} from '../interfaces/demo-response.interface';
import { DemoRepository } from '../repositories/demo.repository';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class DemoService {
  constructor(private readonly demoRepository: DemoRepository) {}

  async getDatabaseTime(): Promise<DatabaseTimeResponse> {
    const serverTime = await this.demoRepository.getServerTime();
    return { serverTime: serverTime.toISOString() };
  }

  getRateLimited(): DemoResponse {
    return {
      message: 'Allowed. Call this route more than 5 times in 10 seconds to get a 429.',
      timestamp: new Date().toISOString(),
    };
  }

  createNote(dto: CreateNoteDto): NoteResponse {
    return { title: dto.title, content: dto.content, receivedAt: new Date().toISOString() };
  }

  async hashPassword(dto: HashPasswordDto): Promise<PasswordHashResponse> {
    const hash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    return { hash, matches: await bcrypt.compare(dto.password, hash) };
  }
}
