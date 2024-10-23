import { User } from '@/application/entities/user';

export class UsersPresenters {
  static toHTTP(user: User) {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      id: user.id,
      avatarUrl: user.avatarUrl,
      acceptNotifications: user.acceptNotifications,
      accountAmount: user.accountAmount,
    };
  }
}
