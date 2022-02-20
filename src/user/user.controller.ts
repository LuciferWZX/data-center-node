import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ControllerPrefix } from 'src/common/types/controller';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { RestRes } from '../common/interceptors/transform.interceptor';
import { User } from './interfaces/user.interface';
import { nanoid } from 'nanoid';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller(ControllerPrefix.user)
export class UserController {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<RestRes<User>> {
    console.log('用户登录：', req.user);
    const { token } = await this.authService.login(req.user);
    return {
      data: {
        ...req.user,
        token,
      },
      msg: '登录成功',
    };
  }
  //查询
  @Get(':id')
  async getUserInfo(@Param('id') uid: string): Promise<RestRes<User>> {
    console.log(`查询的用户id:${uid}`);
    const user: User | undefined = await this.userService.findOneById(uid);
    if (user) {
      delete user.password;
      return {
        data: user,
      };
    }
    throw new HttpException(
      { msg: '该用户不存在', code: 10000 },
      HttpStatus.BAD_REQUEST,
    );
  }
  //新建
  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RestRes<User>> {
    console.log('新增了用户:', createUserDto);
    const user: User = {
      ...createUserDto,
      id: nanoid(),
      createTime: '202002200222',
      updateTime: '202002200222',
    };
    this.userService.create(user);
    return {
      data: user,
    };
  }
  //更新
  @Post('update')
  async updateInfo(
    @Body() info: { id: string; username: string },
  ): Promise<RestRes<any>> {
    // throw new HttpException('禁止访问', HttpStatus.FORBIDDEN);
    return {
      data: { id: info.id, username: info.username },
      msg: '更新成功',
    };
  }
  //获取全部
  @Get()
  async findAll(): Promise<RestRes<User[]>> {
    return {
      data: this.userService.findAll(),
      msg: '查询成功',
    };
  }
}
