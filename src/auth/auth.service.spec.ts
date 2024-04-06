import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByUsername: jest.fn(),
            comparePasswords: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should return a user when sign up is successful', async () => {
      const newUser: User = {
        id: 1,
        username: 'testUser',
        password: 'password',
      };
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(newUser);

      const result = await service.signUp(newUser.username, newUser.password);
      expect(result).toEqual(newUser);
    });
  });

  describe('signIn', () => {
    it('should return a JWT token when sign in is successful', async () => {
      const user: User = {
        id: 1,
        username: 'testUser',
        password: 'password',
      };
      const token = 'fakeToken';
      jest.spyOn(usersService, 'findByUsername').mockResolvedValueOnce(user);
      jest.spyOn(usersService, 'comparePasswords').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(token);

      const result = await service.signIn(user.username, user.password);
      expect(result).toEqual(token);
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      const username = 'testUser';
      const password = 'wrongPassword';
      jest
        .spyOn(usersService, 'findByUsername')
        .mockResolvedValueOnce(undefined);

      await expect(service.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
