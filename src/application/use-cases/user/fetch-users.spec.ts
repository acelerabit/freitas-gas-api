import { User } from './../../entities/user';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { FetchUsers } from './fetch-users';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fetchUsers: FetchUsers;

describe('Fetch Users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fetchUsers = new FetchUsers(inMemoryUsersRepository);
  });

  it('should be able to fetch users', async () => {
    const newUser = User.create({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    const newUser2 = User.create({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    await inMemoryUsersRepository.create(newUser);
    await inMemoryUsersRepository.create(newUser2);

    const { users } = await fetchUsers.execute({
      pagination: {
        page: 1,
        itemsPerPage: 1,
      },
    });

    expect(inMemoryUsersRepository.users).toHaveLength(2);
    expect(users).toHaveLength(1);
  });
});
