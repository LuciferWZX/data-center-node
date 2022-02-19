import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly users: User[];
  constructor() {
    this.users = [];
  }
  create(user: User) {
    this.users.push(user);
  }
  findAll() {
    return this.users;
  }
}
