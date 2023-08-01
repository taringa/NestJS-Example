// registers aliases, DON'T REMOVE THIS LINE!
import 'module-alias/register';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { AppModule } from './modules/app/app.module';

import { ValidationExceptionsFilter, HttpExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn'],
  });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new HttpExceptionFilter(httpAdapter),
    new ValidationExceptionsFilter(httpAdapter),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;

  const options = new DocumentBuilder()
    .setTitle('Account Orchestrator')
    .setDescription(
      'Api documentation for Account Orchestrator service endpoints',
    )
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('documentation', app, document);

  await app.listen(port, async () => {
    console.log(`The server is running on :${port}`);
  });
}

bootstrap();
