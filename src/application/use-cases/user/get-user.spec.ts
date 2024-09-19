import { User } from './../../entities/user';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { GetUser } from './get-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let getUser: GetUser;

describe('Get User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getUser = new GetUser(inMemoryUsersRepository);
  });

  it('should be able to get an user', async () => {
    const newUser = User.create({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    await inMemoryUsersRepository.create(newUser);

    const { user } = await getUser.execute({
      id: newUser.id,
    });

    expect(inMemoryUsersRepository.users[0]).toEqual(user);
  });

  it('should not be able to get an user non existent!', async () => {
    await expect(
      getUser.execute({
        id: 'user-non-existent',
      }),
    ).rejects.toThrowError();
  });
});
