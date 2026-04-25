import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ¡El permiso para que tu formulario de Next.js pueda mandar datos!
  app.enableCors(); 

  // Tu solución que encaja perfecto con Docker
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();