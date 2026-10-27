import { Module } from '@nestjs/common';
import { DemoController } from './controllers/demo.controller';
import { DemoService } from './services/demo.service';

@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
