import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { User } from './../../entities/user';
import { UpdateUserPassword } from './update-user-password';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let updateUserPassword: UpdateUserPassword;

describe('Update User Password', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    updateUserPassword = new UpdateUserPassword(
      inMemoryUsersRepository,
      fakeHasher,
      fakeHasher,
    );
  });

  it('should be able update an user password', async () => {
    const newUser = User.create({
      name: 'user-test',
      email: 'johndoe@test.com',
      password: await fakeHasher.hash('12345'),
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    await inMemoryUsersRepository.create(newUser);

    await updateUserPassword.execute({
      id: newUser.id,
      oldPassword: '12345',
      newPassword: '1234',
    });

    const hashedPassword = await fakeHasher.hash('1234');

    expect(hashedPassword).toEqual(inMemoryUsersRepository.users[0].password);
  });

  it('should not be able update an user password if old password is wrong', async () => {
    const newUser = User.create({
      name: 'user-test',
      email: 'email@test.com',
      password: await fakeHasher.hash('123'),
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    await inMemoryUsersRepository.create(newUser);

    await expect(() =>
      updateUserPassword.execute({
        id: newUser.id,
        oldPassword: 'old-password-wrong',
        newPassword: '1234',
      }),
    ).rejects.toThrowError('A senha atual está incorreta');
  });
});
