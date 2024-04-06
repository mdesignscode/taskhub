import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.authService.signUp(username, password);
      return { message: 'User created successfully', user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signin')
  async signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const token = await this.authService.signIn(username, password);
      return { token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
