import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTCONSTANTS } from '../auth/constants';

@Module({
  imports: [
    JwtModule.register({
      secret: JWTCONSTANTS.secret,
      signOptions: { expiresIn: JWTCONSTANTS.expiresIn },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
