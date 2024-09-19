import { User } from './../../entities/user';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { CreateUser } from './create-user';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { randomUUID } from 'crypto';

let inMemoryUsersRepository;
let fakeHasher: FakeHasher;
let createUser: CreateUser;

describe('Create User', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      createCustomer: vi.fn().mockReturnValue({
        customer: {
          id: randomUUID(),
        },
      }),
    };
  });

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    createUser = new CreateUser(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able create a new user', async () => {
    const newUser = User.create({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'DELIVERYMAN',
      createdAt: new Date(),
    });

    await createUser.execute(newUser);

    expect(inMemoryUsersRepository.users.length).toBe(1);
    expect(inMemoryUsersRepository.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: newUser.email,
        }),
      ]),
    );
  });
});
