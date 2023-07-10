import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({}));

  const swaggerModuleConfig = new DocumentBuilder()
    .setTitle('Nest.Js chat API')
    .setVersion('0.0.1')
    .addBearerAuth({
      type: 'http',
      in: 'header',
      name: 'Authorization',
      scheme: 'bearer',
      bearerFormat: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerModuleConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(+process.env.PORT || 3000);

  console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
