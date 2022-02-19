import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ControllerPrefix } from 'src/common/types/controller';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller(ControllerPrefix.user)
export class UserController {
  constructor(private userService: UserService) {}
  @Get(':id')
  getUserInfo(@Param('id') uid: string): string {
    console.log(uid);
    return `this is id=${uid} user info`;
  }
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): string {
    console.log('新增了用户:', createUserDto);
    this.userService.create({
      ...createUserDto,
      id: 'uuid',
      createTime: '202002200222',
      updateTime: '202002200222',
    });
    return 'create one user success!!';
  }
  @Get()
  async findAll(): Promise<any[]> {
    return this.userService.findAll();
  }
}
