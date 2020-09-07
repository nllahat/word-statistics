import { Injectable } from '@nestjs/common';
import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { OgmaModuleOptions } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OgmaModuleConfig
  implements ModuleConfigFactory<OgmaModuleOptions> {
  constructor(private readonly configService: ConfigService) {}

  createModuleConfig(): OgmaModuleOptions {
    return {
      service: {
        logLevel: this.configService.get('LOG_LEVEL'),
        color: true,
        application: this.configService.get('APPLICATION_NAME'),
      },
      interceptor: {
        http: ExpressParser,
      },
    };
  }
}
