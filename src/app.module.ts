import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ShieldModule } from 'nestjs-shield';
import configuration from './config/configuration';
import { EnvValidator } from './config/validators/env.validator';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: EnvValidator.schema,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
        autoLogging: { ignore: (req) => req.url === '/health' },
        transport:
          process.env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },
      },
    }),
    ShieldModule.forEnv(),
    DatabaseModule,
    HealthModule,
    DemoModule,
  ],
})
export class AppModule {}
