import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //  Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'] ,
    credentials: true, 
  });

  //  Pipes globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🔹 Servir arquivos estáticos
  app.useStaticAssets(join(process.cwd(), 'files-uploads'), {
    prefix: '/uploads/',
  });

  //  Swagger
  const config = new DocumentBuilder()
    .setTitle('API PIB')
    .setDescription('Documentação da API da PIB (NestJS)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
