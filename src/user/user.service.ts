import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { validatePassword } from '../common/utils/utilKid';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Cache } from 'cache-manager';
import { ExpiresInSeconds } from '../auth/constants';

@Injectable()
export class UserService {
  private readonly dataUsers: User[]; //总用户(模拟)
  private readonly users: User[]; //登录的用户
  private readonly userMap: Map<string, User>; //登录的用户
  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;
  @Inject(CACHE_MANAGER)
  private cacheManager: Cache; //内存缓存
  constructor() {
    this.dataUsers = [];
    this.users = [];
    this.userMap = new Map();
  }
  //新建一个用户
  async create(tempUser: CreateUserDto): Promise<any> {
    await this.validateCreateUser(tempUser.username); //验证用户名密码
    return await this.userRepository.save(tempUser);
  }
  //查询所有用户
  findAll(options?: { fromCache?: boolean }) {
    if (options?.fromCache) {
      return this.users;
    }
    return this.dataUsers;
  }
  //通过id查询用户
  async findOneById(id: string): Promise<User | undefined> {
    return this.userMap.get(id);
    // if (options?.fromCache) {
    //   const user = this.users.find((user) => user.id === id);
    //   //找到用户则返回，没找到就去库里面找
    //   if (user) {
    //     return this.users.find((user) => user.id === id);
    //   }
    // }
    // return this.dataUsers.find((user) => user.id === id);
  }
  //用户名密码登录
  async upLogin(username: string, password: string): Promise<User | undefined> {
    //先从本地查找是否这个用户登陆过
    const userList = Array.from(this.userMap.values());

    let user: User | undefined;
    //验证本地用户是否存在
    for (let i = 0; i < userList.length; i++) {
      const isPass = await validatePassword(password, userList[i].password);
      if (userList[i].username === username && isPass) {
        //说明找到啦
        const tempUser = userList[i];
        //看看缓存里面的真实数据token是否过期了
        user = await this.cacheManager.get<User>(tempUser.id);
        console.log('缓存里面拿的数据', user);
        break;
      }
    }
    if (user === undefined) {
      //说明该用户之前没有登陆过，需要去redis里面查询，如果还没有就从表里面查询
      user = await this.userRepository.findOne({
        where: {
          username: username,
        },
      });
      //如果用户不存在或者密码不正确就返回
      if (!user || !(await validatePassword(password, user.password))) {
        throw new HttpException(
          { msg: '用户名或者密码不正确', code: 10000 },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    //说明用户存在
    return user;
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
  async setCache(user: User) {
    await this.cacheManager.set(user.id, user, { ttl: ExpiresInSeconds });
    this.userMap.set(user.id, user);
  }
  //验证用户名和密码
  async validateCreateUser(username: string) {
    const user = await this.userRepository.findOne({
      select: ['id'],
      where: { username: username },
    });
    if (user) {
      //该用户名的用户已存在
      throw new HttpException(
        {
          code: 40003,
          msg: `该用户名已存在，请重新输入`,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
