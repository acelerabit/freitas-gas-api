import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { ActivateSubscription } from './activate-subscription';
import { randomUUID } from 'crypto';
import { Subscription } from 'src/application/entities/subscription';
import { User } from 'src/application/entities/user';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { vi } from 'vitest';

describe('Activate subscription usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      activateSubscription: vi.fn().mockReturnValue({
        paymentMethodId: randomUUID(),
        subscription: {
          status: 'canceled',
        },
      }),
    };
  });

  it('should be able activate a subscription', async () => {
    const userRepository = new InMemoryUsersRepository();
    const planRepository = new InMemoryPlanRepository();
    const subRepository = new InMemorySubscriptionRepository(userRepository);
    const stripeServiceMock = mock();

    const usecase = new ActivateSubscription(
      userRepository,
      stripeServiceMock,
      subRepository,
      planRepository,
    );

    const newUser = new User({
      email: 'email@test.com',
      name: 'user test',
      password: '123',
      role: 'ADMIN',
      createdAt: new Date(),
    });

    const newSubscription = new Subscription({
      active: true,
      externalId: randomUUID(),
      planId: randomUUID(),
      planStatus: 'active',
      value: 100,
      userId: newUser.id,
    });

    newUser.subscriptionId = newSubscription.id;
    newUser.saveSubscription(newSubscription);

    await userRepository.create(newUser);

    await subRepository.create(newSubscription);

    await usecase.execute({
      paymentMethod: randomUUID(),
      userId: newUser.id,
    });

    const sub = await subRepository.findById(newSubscription.id);
  });
});
