import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { GlobalValidationPipeProvider } from './utils/global-validation.pipe';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './database/database.provider';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { jwtConstants } from './modules/authentication/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeormModuleOptions),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [GlobalValidationPipeProvider],
})
export class AppModule {}
