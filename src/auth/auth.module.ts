import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Strategys/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWTCONSTANTS } from './constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWTCONSTANTS.secret,
      signOptions: { expiresIn: JWTCONSTANTS.expiresIn },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService, AuthModule],
})
export class AuthModule {}
