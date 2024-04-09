import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    username: string,
    password: string,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.usersService.create(username, password);

    return this.setPayload(user);
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.setPayload(user);
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findOne(decoded.sub);
      return user;
    } catch (error) {
      return null;
    }
  }

  private async setPayload(user: User) {
    Object.defineProperties(user, {
      password: {
        enumerable: false,
      },
    });

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (
      user &&
      (await this.usersService.comparePasswords(password, user.password))
    ) {
      return user;
    }
    return null;
  }
}
