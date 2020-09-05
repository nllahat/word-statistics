import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if ((exception as Error).message && (exception as Error).stack) {
      this.logger.error(
        `Message: ${(exception as Error).message}. Stack: ${
          (exception as Error).stack
        }`,
      );
    } else {
      try {
        this.logger.error(JSON.stringify(exception));
      } catch (e) {
        this.logger.error(exception);
      }
    }

    let status: number;
    let data: any;

    if (
      (exception as AxiosError).isAxiosError &&
      (exception as AxiosError).response
    ) {
      status = (exception as AxiosError).response.status;
      data = (exception as AxiosError).response.data;
    } else {
      status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const res = exception instanceof HttpException && exception.getResponse();
      data = res ? (res as any).message : undefined;
    }

    const object = {
      status,
      data,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(object);
  }
}
