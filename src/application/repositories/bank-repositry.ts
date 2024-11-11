import { BankAccount } from '../entities/bank-account';

export abstract class BankAccountsRepository {
  abstract create(bankAccount: BankAccount): Promise<void>;
  abstract findAllWithoutPaginate(): Promise<BankAccount[]>;
  abstract count(): Promise<number>;
  abstract findById(id: string): Promise<BankAccount | null>;
  abstract update(bankAccount: BankAccount): Promise<void>;
  abstract alreadyGotThisName(name: string): Promise<BankAccount | null>;
  abstract alreadyGotThisPaymentMethods(paymentMethods: string[], bankId?: string): Promise<boolean>
  abstract accountToThisPaymentMethod(paymentMethod: string): Promise<BankAccount | null>
  abstract delete(id: string): Promise<void>;
}
