import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly users: User[];
  constructor() {
    this.users = [];
  }
  //新建一个用户
  create(user: User) {
    this.users.push(user);
  }
  //查询所有用户
  findAll() {
    return this.users;
  }
  //通过id查询用户
  async findOneById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }
  //用户名，密码登录
  async findOneByPassword(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    return this.users.find(
      (user) => user.password === password && user.username === username,
    );
  }
}
