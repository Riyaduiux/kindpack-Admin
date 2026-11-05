import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../types/api-response.type';

/** Marker returned by services that want to set the message and/or pagination meta. */
export class Envelope<T> {
  constructor(
    public readonly data: T,
    public readonly message = 'OK',
    public readonly meta?: ApiResponse['meta'],
  ) {}
}

/** Wraps every successful response in { success, statusCode, message, data, meta? }. */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<unknown>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<unknown>> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((body) => {
        if (body instanceof Envelope) {
          return { success: true, statusCode: res.statusCode, message: body.message, data: body.data ?? null, ...(body.meta ? { meta: body.meta } : {}) };
        }
        return { success: true, statusCode: res.statusCode, message: 'OK', data: (body as unknown) ?? null };
      }),
    );
  }
}
