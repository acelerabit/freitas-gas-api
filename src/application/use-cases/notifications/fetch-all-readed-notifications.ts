import { PaginationParams } from '@/@shared/pagination-interface';
import { Injectable } from '@nestjs/common';
import { Notification } from 'src/application/entities/notification';
import { NotificationRepository } from 'src/application/repositories/notification-repository';

interface FetchAllReadedNotificationsRequest {
  userId: string;
  pagination: PaginationParams
}

interface FetchAllReadedNotificationsResponse {
  notifications: Notification[];
}

@Injectable()
export class FetchAllReadedNotifications {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    userId,
    pagination
  }: FetchAllReadedNotificationsRequest): Promise<FetchAllReadedNotificationsResponse> {
    const notifications = await this.notificationsRepository.fetchAllReaded(
      userId,
      pagination
    );

    return { notifications };
  }
}
