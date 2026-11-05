import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@app/db';
import { ApiResponse } from '../types/api-response.type';

/** Returns every error in the same envelope shape the clients expect. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong. Please try again.';
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') message = res;
      else {
        const r = res as { message?: string | string[]; errors?: Record<string, string[]> };
        message = Array.isArray(r.message) ? r.message.join(', ') : (r.message ?? exception.message);
        errors = r.errors;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
      } else if (exception.code === 'P2002') {
        statusCode = HttpStatus.CONFLICT;
        message = 'This record already exists';
      } else this.logger.error(exception);
    } else {
      this.logger.error(exception);
    }

    const body: ApiResponse = { success: false, statusCode, message, data: null, ...(errors ? { errors } : {}) };
    httpAdapter.reply(ctx.getResponse(), body, statusCode);
  }
}
