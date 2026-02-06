import { FactoryProvider } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';

export const jwtServiceProvider: FactoryProvider = {
  provide: JwtService,
  useFactory: () => {
    return {
      signAsync: jest.fn().mockResolvedValue('hash'),
    };
  },
};
