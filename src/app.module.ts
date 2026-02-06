import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { GlobalValidationPipeProvider } from './utils/global-validation.pipe';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './database/database.provider';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeormModuleOptions),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    AuthenticationModule,
    ProductModule,
  ],
  controllers: [],
  providers: [GlobalValidationPipeProvider],
})
export class AppModule {}
