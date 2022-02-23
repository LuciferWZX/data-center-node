import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const mysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'data_center',
  //entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  logging: true,
  synchronize: true, //示是否应该在每次应用程序启动时自动创建数据库模式
};
export default mysqlConfig;
