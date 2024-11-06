import { BankAccount } from '../entities/bank-account';

export abstract class BankAccountsRepository {
  abstract create(bankAccount: BankAccount): Promise<void>;
  abstract findAllWithoutPaginate(): Promise<BankAccount[]>;
  abstract count(): Promise<number>;
  abstract findById(id: string): Promise<BankAccount | null>;
  abstract update(bankAccount: BankAccount): Promise<void>;
  abstract alreadyGotThisPaymentMethods(paymentMethods: string[], bankId?: string): Promise<boolean>
  abstract delete(id: string): Promise<void>;
}
