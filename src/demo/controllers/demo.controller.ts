import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RateLimit } from 'nestjs-shield';
import { CreateNoteDto } from '../dto/create-note.dto';
import { HashPasswordDto } from '../dto/hash-password.dto';
import {
  DatabaseTimeResponse,
  DemoResponse,
  NoteResponse,
  PasswordHashResponse,
} from '../interfaces/demo-response.interface';
import { DemoService } from '../services/demo.service';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('database')
  getDatabaseTime(): Promise<DatabaseTimeResponse> {
    return this.demoService.getDatabaseTime();
  }

  @Get('rate-limit')
  @RateLimit({ limit: 5, ttl: 10_000 })
  getRateLimited(): DemoResponse {
    return this.demoService.getRateLimited();
  }

  @Post('notes')
  createNote(@Body() dto: CreateNoteDto): NoteResponse {
    return this.demoService.createNote(dto);
  }

  @Post('password-hash')
  @RateLimit({ limit: 5, ttl: 60_000 })
  hashPassword(@Body() dto: HashPasswordDto): Promise<PasswordHashResponse> {
    return this.demoService.hashPassword(dto);
  }
}
