import { Module, ClassSerializerInterceptor, HttpModule } from '@nestjs/common';
import { WordsModule } from './modules/words/words.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseTransformerInterceptor } from './shared/interceptors/responseTransformer.interceptor';
import { AllExceptionsFilter } from './shared/interceptors/filters/allExceptions.filter';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WordsModule,
  ],
})
export class RootModule {}
