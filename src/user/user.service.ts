import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { validatePassword } from '../common/utils/utilKid';

@Injectable()
export class UserService {
  private readonly dataUsers: User[]; //总用户(模拟)
  private readonly users: User[]; //登录的用户
  constructor() {
    this.dataUsers = [];
    this.users = [];
  }
  //新建一个用户
  create(user: User) {
    this.dataUsers.push(user);
  }
  //查询所有用户
  findAll(options?: { fromCache?: boolean }) {
    if (options?.fromCache) {
      return this.users;
    }
    return this.dataUsers;
  }
  //通过id查询用户
  async findOneById(
    id: string,
    options?: { fromCache?: boolean },
  ): Promise<User | undefined> {
    if (options?.fromCache) {
      //是否从缓存获取
      return this.users.find((user) => user.id === id);
    }
    return this.dataUsers.find((user) => user.id === id);
  }
  //用户名，密码登录
  async findOneByPassword(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    return this.dataUsers.find(
      (user) =>
        validatePassword(password, user.password) && user.username === username,
    );
  }

  //登录的时候将该用户加入缓存(有老的就替换掉)
  async addCachedUsers(user: User) {
    const oldUserIndex = this.users.findIndex((_user) => _user.id === user.id);
    if (oldUserIndex > -1) {
      this.users[oldUserIndex] = user;
    } else {
      this.users.push(user);
    }
  }
}
