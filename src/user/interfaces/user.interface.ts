import { UserEntity } from 'src/entity/user.entity';

export interface User extends UserEntity {
  token?: string;
}
