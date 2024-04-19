import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import * as csurf from 'csurf';
require('dotenv').config();

const portNumber = parseInt(process.env.PORT, 10) || 4444;
// docker will not accept NaN, -ve, and greater than 65535
if (isNaN(portNumber) || portNumber < 0 || portNumber > 65535) {
  console.error(`Invalid port number: ${portNumber}`);
  process.exit(1);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this will exclude data that is not defined on our model.
    }),
  );

  // cross-origin resource sharing allows resources to be requested from another domain.
  app.enableCors();

  // to mitigate cross-site request forgery or malicious exploit of unauthorized commands...
  // app.use(csurf())

  // swagger docs
  const config = new DocumentBuilder()
    .setTitle('IE-Network Solutions LMS, APIs Docs')
    .setDescription('This docs has all under construction APIs for IE Network Solutions LMS.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(portNumber);
}

bootstrap().then(() => {
  const logger = new Logger();
  logger.log(`The server is started at http://localhost:${portNumber}`);
  logger.log(`You are prompt to access the docs at http://localhost:${portNumber}/api`);
});
