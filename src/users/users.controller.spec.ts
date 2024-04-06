import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // Import getRepositoryToken
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User), // Provide the repository token
          useClass: Repository, // Use the Repository class
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userData = { username: 'testUser', password: 'testPassword' };
      const createdUser: User = { id: 1, ...userData };
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(createdUser);

      const result = await usersController.createUser(userData);
      expect(result).toEqual(createdUser);
    });
  });

  describe('getUser', () => {
    it('should get a user by id', async () => {
      const userData: User = {
        id: 1,
        username: 'testUser',
        password: 'testPassword',
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(userData);

      const result = await usersController.getUser({ id: 1 });
      expect(result).toEqual(userData);
    });
  });

  describe('removeUser', () => {
    it('should remove a user by id', async () => {
      const userId = 1;
      jest.spyOn(usersService, 'remove').mockResolvedValueOnce(undefined);

      const result = await usersController.removeUser({ id: userId });
      expect(result).toBeUndefined();
    });
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      const usersData: User[] = [
        { id: 1, username: 'testUser1', password: 'testPassword1' },
        { id: 2, username: 'testUser2', password: 'testPassword2' },
      ];
      jest.spyOn(usersService, 'findAll').mockResolvedValueOnce(usersData);

      const result = await usersController.getUsers();
      expect(result).toEqual(usersData);
    });
  });
});
