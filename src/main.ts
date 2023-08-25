import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './modules/conversations/adapters/redis.adapter';
import { WsAdapter } from '@nestjs/platform-ws';
import { SocketIoAdapter } from './modules/conversations/adapters/socket-io.adapters';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exceiption.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());

  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new SuccessInterceptor());

  await app.listen(process.env.MAIN_PORT);

  Logger.log(`Application runnin on port ${process.env.MAIN_PORT}`);
}
bootstrap();
