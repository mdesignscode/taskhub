import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should return a success message and user when sign up is successful', async () => {
      const username = 'testUser';
      const password = 'testPassword';
      const newUser = { id: 1, username, password };
      jest.spyOn(authService, 'signUp').mockResolvedValueOnce(newUser);

      const result = await controller.signUp(username, password);
      expect(result).toEqual({
        message: 'User created successfully',
        user: newUser,
      });
    });

    it('should throw BadRequestException when sign up fails', async () => {
      const username = 'testUser';
      const password = 'testPassword';
      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValueOnce(new Error('User already exists'));

      await expect(controller.signUp(username, password)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('signIn', () => {
    it('should return a token when sign in is successful', async () => {
      const username = 'testUser';
      const password = 'testPassword';
      const token = 'fakeToken';
      jest
        .spyOn(authService, 'signIn')
        .mockResolvedValueOnce({ access_token: token });

      const result = await controller.signIn(username, password);
      expect(result).toEqual({ token });
    });

    it('should throw UnauthorizedException when sign in fails', async () => {
      const username = 'testUser';
      const password = 'testPassword';
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(controller.signIn(username, password)).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
