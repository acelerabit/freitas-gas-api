import { PaginationParams } from '@/@shared/pagination-interface';
import { AccountTransfer } from '../entities/account-transfer';

export abstract class AccountsTransferRepository {
  abstract create(accountTransfer: AccountTransfer): Promise<void>;
  abstract findAll(pagination: PaginationParams): Promise<AccountTransfer[]>;
  abstract findById(id: string): Promise<AccountTransfer | null>;
  abstract update(accountTransfer: AccountTransfer): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
