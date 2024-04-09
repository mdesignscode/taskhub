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
            findById: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
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
    it('should return access token when sign in is successful', async () => {
      const username = 'testUser';
      const password = 'password';
      const user: User = {
        id: 1,
        username: 'testUser',
        password: 'hashedPassword', // Assuming password is hashed in DB
      };
      jest.spyOn(usersService, 'findByUsername').mockResolvedValueOnce(user);
      jest.spyOn(usersService, 'comparePasswords').mockResolvedValueOnce(true);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('mockAccessToken');

      const result = await service.signIn(username, password);
      expect(result.access_token).toBe('mockAccessToken');
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const username = 'testUser';
      const password = 'wrongPassword';
      jest.spyOn(usersService, 'findByUsername').mockResolvedValueOnce(null);

      await expect(service.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyToken', () => {
    it('should return user if token is valid', async () => {
      const validToken = 'validToken';
      const decodedToken = { username: 'testUser', sub: 1 };
      const user: User = {
        id: 1,
        username: 'testUser',
        password: 'hashedPassword',
      };
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(decodedToken);
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);

      const result = await service.verifyToken(validToken);
      expect(result).toEqual(user);
    });

    it('should return null if token is invalid', async () => {
      const invalidToken = 'invalidToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      const result = await service.verifyToken(invalidToken);
      expect(result).toBeNull();
    });
  });
});
