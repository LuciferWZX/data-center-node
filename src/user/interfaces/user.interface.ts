import { UserPermission, UserStatus } from '../dtos/type';

export interface User {
  id: string;
  username: string;
  password: string;
  active: boolean;
  status: UserStatus; //默认 正常
  permissions: UserPermission; //默认 正常权限
  createTime: string;
  updateTime: string;
}
