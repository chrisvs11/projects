import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';

import { UserModel } from './model/user.model';

import { CreateUserInput } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() newUser: CreateUserInput): Promise<UserModel> {
    return this.userService.create(newUser);
  }
}
