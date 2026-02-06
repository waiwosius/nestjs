import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors, } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { PageDto } from '../dtos/page.dto';
import { PageResult } from '../interfaces/page-result.interface';
import { TRANSFORM_OPTIONS } from './serialize.interceptor';

/**
 * Decorator to serialize paginated responses.
 *
 * @param dto
 */
export function PageSerialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new PageSerializeInterceptor(dto));
}

/**
 * Transforms paginated data by mapping the 'items' array to the provided DTO
 * and returning a new PageDto instance.
 */
export class PageSerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    callHandler: CallHandler,
  ): Observable<any> {
    return callHandler.handle().pipe(
      map((data: PageResult<any>) => {
        const transformedItems = plainToInstance(
          this.dto,
          data.items,
          TRANSFORM_OPTIONS,
        );

        return new PageDto(
          transformedItems,
          data.total,
          data.limit,
          data.offset,
        );
      }),
    );
  }
}
