import { User } from './../../entities/user';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { UpdateUser } from './update-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let updateUser: UpdateUser;

describe('Update User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    updateUser = new UpdateUser(inMemoryUsersRepository);
  });

  it('should be able update an user', async () => {
    const newUser = User.create({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    await inMemoryUsersRepository.create(newUser);

    await updateUser.execute({
      id: newUser.id,
      name: 'new name',
      email: 'johndoe@example.com',
      role: 'ADMIN',
      acceptNotifications: true,
    });

    expect(inMemoryUsersRepository.users[0].name).toEqual('new name');
    expect(inMemoryUsersRepository.users[0].email).toEqual(
      'johndoe@example.com',
    );
    expect(inMemoryUsersRepository.users[0].role).toEqual('ADMIN');
  });
});
