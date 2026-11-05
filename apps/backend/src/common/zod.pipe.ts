import { PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { ZodSchema } from 'zod';

/** Validates a body/query with Zod and returns 422 { message, errors: { field: [reason] } }. */
export class ZodPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value ?? {});
    if (result.success) return result.data;
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || 'body';
      (errors[key] ??= []).push(issue.message);
    }
    throw new UnprocessableEntityException({ message: 'Validation failed', errors });
  }
}
