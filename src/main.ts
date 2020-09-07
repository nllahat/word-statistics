import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { OgmaService } from '@ogma/nestjs-module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule, {
    logger: false,
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8080;
  const logger = app.get<OgmaService>(OgmaService);

  app.useLogger(logger);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  logger.log(`ENV: ${configService.get('NODE_ENV')}`);

  // This will cause class-validator to use the nestJS module resolution,
  // the fallback option is to spare our selfs from importing all the class-validator modules to nestJS
  useContainer(app.select(RootModule), { fallbackOnErrors: true });

  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}

bootstrap();
