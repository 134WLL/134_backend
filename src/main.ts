import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './conversations/adapters/redis.adapter';
import { WsAdapter } from '@nestjs/platform-ws';
import { SocketIoAdapter } from './conversations/adapters/socket-io.adapters';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new SuccessInterceptor());

  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  //   credentials: true,
  // });

  await app.listen(process.env.MAIN_PORT);

  Logger.log(`Application runnin on port ${process.env.MAIN_PORT}`);
}
bootstrap();
