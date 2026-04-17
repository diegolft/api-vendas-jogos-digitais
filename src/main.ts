import 'reflect-metadata';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'check', method: RequestMethod.GET }],
  });

  setupSwagger(app);

  const port = Number(process.env.APP_PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}

bootstrap();

