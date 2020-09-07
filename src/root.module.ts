import { Module, ClassSerializerInterceptor, HttpModule } from '@nestjs/common';
import { WordsModule } from './modules/words/words.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseTransformerInterceptor } from './shared/interceptors/responseTransformer.interceptor';
import { AllExceptionsFilter } from './shared/filters/allExceptions.filter';
import { OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import { OgmaModuleConfig } from './shared/config/ogmaModuleConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    OgmaModule.forRootAsync({
      useClass: OgmaModuleConfig,
      imports: [ConfigModule],
    }),
    WordsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class RootModule {}
