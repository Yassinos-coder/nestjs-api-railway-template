import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DemoController } from './controllers/demo.controller';
import { DemoRepository } from './repositories/demo.repository';
import { DemoService } from './services/demo.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DemoController],
  providers: [DemoService, DemoRepository],
})
export class DemoModule {}
