import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RolesGuard } from './common/guards/roles.guard';
import { SqlExceptionFilter } from './common/filters/sql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); //全局HTTP异常处理
  app.useGlobalFilters(new SqlExceptionFilter()); //全局SQL异常处理
  app.useGlobalInterceptors(new TransformInterceptor()); //全局响应拦截器
  app.useGlobalGuards(new RolesGuard()); //全局拦截被删除的用户使用api
  await app.listen(3000);
}
bootstrap().then(() => {
  console.info('后台已启用');
});
