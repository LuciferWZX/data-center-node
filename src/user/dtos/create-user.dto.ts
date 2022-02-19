import { UserPermission, UserStatus } from './type';

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly active: boolean;
  readonly status: UserStatus; //默认 正常
  readonly permissions: UserPermission; //默认 正常权限
}
