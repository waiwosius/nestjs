import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { GlobalValidationPipeProvider } from './utils/global-validation.pipe';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './database/database.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeormModuleOptions),
    UserModule,
  ],
  controllers: [],
  providers: [GlobalValidationPipeProvider],
})
export class AppModule {}
