import { PaginationParams } from '@/@shared/pagination-interface';
import { Injectable } from '@nestjs/common';
import { Notification } from 'src/application/entities/notification';
import { NotificationRepository } from 'src/application/repositories/notification-repository';

interface FetchAllUnreadNotificationsRequest {
  userId: string;
}

interface FetchAllUnreadNotificationsResponse {
  notifications: Notification[];
}

@Injectable()
export class FetchAllUnreadNotificationsWithoutPaginate {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    userId,
  }: FetchAllUnreadNotificationsRequest): Promise<FetchAllUnreadNotificationsResponse> {
    const notifications =
      await this.notificationsRepository.fetchAllUnreadWithoutPaginate(userId);

    return { notifications };
  }
}
