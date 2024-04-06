import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  getUser(@Body() body: { id: number }) {
    return this.userService.findOne(body.id);
  }

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Post('remove')
  removeUser(@Body() body: { id: number }) {
    return this.userService.remove(body.id);
  }

  @Post('create')
  createUser(@Body() body: { username: string; password: string }) {
    return this.userService.create(body.username, body.password);
  }
}
