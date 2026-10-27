import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const corsOrigins = config.get<string[]>('corsOrigins') ?? [];
  const swaggerEnabled = config.get<boolean>('swaggerEnabled') ?? false;

  app.useLogger(app.get(Logger));
  app.use(helmet({ contentSecurityPolicy: swaggerEnabled ? false : undefined }));
  app.use(hpp());
  app.use(compression());
  app.useGlobalPipes(
    new SanitizePipe(),
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableShutdownHooks();
  if (corsOrigins.length > 0) app.enableCors({ origin: corsOrigins });

  if (swaggerEnabled) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('NestJS API').setVersion('0.2.0').addBearerAuth().build(),
    );
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(config.get<number>('port') ?? 3000, '0.0.0.0');
}

bootstrap();
