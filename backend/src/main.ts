import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())

  const cors = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
  app.enableCors(cors)

  // Configuration de Socket.io avec CORS
  app.useWebSocketAdapter(new IoAdapter(app));

  app.setGlobalPrefix('api');
  await app.listen(5000);
}
bootstrap();
