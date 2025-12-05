import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { GlobalValidationPipeProvider } from './utils/global-validation.pipe';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [GlobalValidationPipeProvider],
})
export class AppModule {}
