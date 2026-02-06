import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors, } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    callHandler: CallHandler,
  ): Observable<any> {
    return callHandler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
