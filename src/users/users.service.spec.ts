import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: User = {
        id: 1,
        username: 'testUser',
        password: 'testPassword',
      };

      // Mocking bcrypt.hash
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValueOnce('hashedPassword' as never);

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

      const createdUser = await usersService.create(
        user.username,
        user.password,
      );
      expect(createdUser).toEqual(user);
    });
  });
});
