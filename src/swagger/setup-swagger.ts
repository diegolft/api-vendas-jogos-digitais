import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_BEARER_NAME } from '../shared/constants/swagger.constants';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API Vendas de Jogos Digitais')
    .setDescription(
      'REST da loja de jogos digitais. Rotas protegidas exigem header Authorization: Bearer (token do POST /auth/login).',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'Token JWT retornado por POST /auth/login',
      },
      SWAGGER_BEARER_NAME,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API — Jogos Digitais',
  });
}
