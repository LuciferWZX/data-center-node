import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ControllerPrefix } from './common/types/controller';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { VerifyTokenMiddleware } from './common/middlewares/verifyToken.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfig from './databases/mysql.config';
// import { Connection } from 'typeorm';
import { GLOBAL_API_PREFIX } from './common/types/constant';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forRoot(mysqlConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  //private readonly connection: Connection
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude(
        `${GLOBAL_API_PREFIX}/${ControllerPrefix.user}/create`,
        `${GLOBAL_API_PREFIX}/${ControllerPrefix.user}/login`,
      )
      .forRoutes(UserController);
  }
}
