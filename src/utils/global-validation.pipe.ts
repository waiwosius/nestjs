import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

export const GlobalValidationPipeProvider = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
};
