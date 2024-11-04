import { PaginationParams } from '@/@shared/pagination-interface';
import { Notification } from '../entities/notification';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
  abstract findById(id: string): Promise<Notification | null>;
  abstract fetchAll(userId: string): Promise<Notification[]>;
  abstract fetchAllUnread(
    userId: string,
    pagination?: PaginationParams,
  ): Promise<Notification[]>;
  abstract fetchAllUnreadWithoutPaginate(
    userId: string,
  ): Promise<Notification[]>;
  abstract fetchAllReaded(
    userId: string,
    pagination?: PaginationParams,
  ): Promise<Notification[]>;
  abstract read(id: string): Promise<void>;
  abstract readAll(userId: string): Promise<void>;
}
