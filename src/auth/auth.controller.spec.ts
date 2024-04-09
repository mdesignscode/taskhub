import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const username = 'testUser',
    password = 'testPassword',
    newUser = { id: 1, username, password },
    mockResponse = {
      cookie: jest.fn(),
      json: jest.fn(),
    } as any,
    token = 'mockToken',
    authorizedUser = { access_token: token, user: newUser };

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
      jest.spyOn(authService, 'signUp').mockResolvedValueOnce(newUser);

      const result = await controller.signUp(username, password);
      expect(result).toEqual({
        message: 'User created successfully',
        user: newUser,
      });
    });

    it('should throw BadRequestException when sign up fails', async () => {
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
      jest.spyOn(authService, 'signIn').mockResolvedValueOnce(authorizedUser);

      const result = await controller.signIn(username, password, mockResponse);
      expect(result).toEqual(authorizedUser);
    });

    it('should throw UnauthorizedException when sign in fails', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(
        controller.signIn(username, password, {} as any),
      ).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should set cookie and return user when sign in is successful', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValueOnce(authorizedUser);

      await controller.signIn(username, password, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', token);
      expect(mockResponse.json).toHaveBeenCalledWith(newUser);
    });
  });
});
