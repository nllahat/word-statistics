import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  took: string;
}

@Injectable()
export class ResponseTransformerInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const now = Date.now();

    return next
      .handle()
      .pipe(map(data => ({ data, took: `${Date.now() - now} ms` })));
  }
}
