import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors, } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const TRANSFORM_OPTIONS = {
  excludeExtraneousValues: true,
  enableImplicitConversion: true,
} as const;

/**
 * Decorator to serialize single objects or simple arrays.
 *
 * @param dto
 */
export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/**
 * Transforms response data into instances of the provided DTO.
 */
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, TRANSFORM_OPTIONS);
      }),
    );
  }
}
