import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/user.module';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@Module({
  imports: [UserModule],
  providers: [AuthenticationService, AuthenticationGuard],
  controllers: [AuthenticationController],
  exports: [AuthenticationGuard, UserModule],
})
export class AuthenticationModule {}
