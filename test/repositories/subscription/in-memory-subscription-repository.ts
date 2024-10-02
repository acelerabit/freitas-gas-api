import { Subscription } from 'src/application/entities/subscription';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

export class InMemorySubscriptionRepository implements SubscriptionRepository {
  constructor(private userRepository: UsersRepository) {}

  public subs: Subscription[] = [];

  async create(sub: Subscription): Promise<void> {
    this.subs.push(sub);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subs;
  }

  async findAllSubsWithThisPlan(planId: string): Promise<number> {
    return this.subs.filter((sub) => sub.planId === planId).length;
  }

  async findById(id: string): Promise<Subscription> {
    const subscriptionIndex = this.subs.findIndex(
      (subscription) => subscription.id === id,
    );

    if (subscriptionIndex < 0) {
      return null;
    }

    return this.subs[subscriptionIndex];
  }

  async update(sub: Subscription): Promise<void> {
    const subscriptionIndex = this.subs.findIndex(
      (subscription) => subscription.id === sub.id,
    );

    if (subscriptionIndex < 0) {
      return;
    }

    this.subs[subscriptionIndex] = sub;

    const user = await this.userRepository.findById(sub.userId);

    user.updateUserSubscription(sub);

    await this.userRepository.update(user);
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const subscriptionIndex = this.subs.findIndex(
      (subscription) => subscription.userId === userId,
    );

    if (subscriptionIndex < 0) {
      return null;
    }

    return this.subs[subscriptionIndex];
  }

  async count(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
