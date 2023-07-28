import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //anteponemos el prefijo api par los endpoint
  app.setGlobalPrefix('api')

  // Validacinone globales
  app.useGlobalPipes(
    new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true, })
  );


  await app.listen(3000);
}
bootstrap();
