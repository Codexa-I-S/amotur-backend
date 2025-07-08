import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API do AMOTUR')
    .setDescription('Documentação do API do AMOTUR com NestJs + Prisma + Swagger')
    .setVersion('1.0')
    .addBearerAuth({// Esquema JWT Bearer
    type:'http',
    scheme:'bearer',
    bearerFormat:'JWT',
    name:'Authorization',
    in:'heaher'
    })
    .build();

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api',app,document)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
    })
  );
  app.enableCors({
  origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
  credentials:true
}); 
  await app.listen(process.env.PORT ?? 3123);
}
bootstrap();
