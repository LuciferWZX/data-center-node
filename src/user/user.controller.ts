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
import { encryption } from '../common/utils/utilKid';

@Controller(ControllerPrefix.user)
export class UserController {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
  ) {}

  //注册
  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RestRes<any>> {
    const password = encryption(createUserDto.password);
    const result = await this.userService.create({
      ...createUserDto,
      password,
    });
    return {
      data: result,
      msg: '注册成功!',
    };
  }
  //登录
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<RestRes<User>> {
    const { token } = await this.authService.login(req.user);
    const user = {
      ...req.user,
      token,
    };
    await this.userService.setCache(user);
    return {
      data: user,
      msg: '登录成功',
    };
  }

  //查询
  @Get(':id')
  async getUserInfo(@Param('id') uid: string): Promise<RestRes<User>> {
    console.log(`查询的用户id:${uid}`);
    const user: User | undefined = await this.userService.findOneById(uid);
    if (user) {
      return {
        data: user,
      };
    }
    throw new HttpException(
      { msg: '该用户不存在', code: 10000 },
      HttpStatus.BAD_REQUEST,
    );
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
      data: this.userService.findAll({ fromCache: true }),
      msg: '查询成功',
    };
  }
}
