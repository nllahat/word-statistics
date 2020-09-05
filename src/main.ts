import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8080;

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // This will cause class-validator to use the nestJS module resolution,
  // the fallback option is to spare our selfs from importing all the class-validator modules to nestJS
  useContainer(app.select(RootModule), { fallbackOnErrors: true });

  await app.listen(port);
}
bootstrap();
