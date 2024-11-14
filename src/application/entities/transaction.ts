import { Replace } from '@/helpers/Replace';
import { TransactionType, TransactionCategory } from '@prisma/client';
import { randomUUID } from 'crypto';
import { User } from './user';
import { BankAccount } from './bank-account';

export interface TransactionProps {
  transactionType: TransactionType;
  mainAccount?: boolean;
  category: TransactionCategory;
  userId: string;
  referenceId?: string;
  customCategory?: string;
  amount: number;
  description?: string;
  createdAt?: Date;
  depositDate?: Date;
  bank?: string;
  user?: User;
  bankAccount?: BankAccount;
  bankAccountId?: string;
  senderUserId?: string;
}

export class Transaction {
  private _id: string;
  private _props: TransactionProps;

  constructor(props: TransactionProps, id?: string) {
    this._id = id ?? randomUUID();
    this._props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id(): string {
    return this._id;
  }

  get amount(): number {
    return this._props.amount;
  }

  set amount(value: number) {
    this._props.amount = value;
  }

  get description(): string {
    return this._props.description;
  }

  set description(value: string) {
    this._props.description = value;
  }

  get user(): User {
    return this._props.user;
  }

  set user(value: User) {
    this._props.user = value;
  }

  get bank(): string {
    return this._props.bank;
  }

  set bank(value: string) {
    this._props.bank = value;
  }

  get bankAccountId(): string {
    return this._props.bankAccountId;
  }

  set bankAccountId(value: string) {
    this._props.bankAccountId = value;
  }

  get senderUserId(): string {
    return this._props.senderUserId;
  }

  set senderUserId(value: string) {
    this._props.senderUserId = value;
  }

  get bankAccount(): BankAccount {
    return this._props.bankAccount;
  }

  set bankAccount(value: BankAccount) {
    this._props.bankAccount = value;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  get depositDate(): Date {
    return this._props.depositDate;
  }

  set depositDate(value: Date) {
    this._props.depositDate = value;
  }

  get transactionType(): TransactionType {
    return this._props.transactionType;
  }

  get mainAccount(): boolean {
    return this._props.mainAccount;
  }

  get category(): TransactionCategory {
    return this._props.category;
  }

  set userId(userId: string) {
    this._props.userId = userId;
  }

  get userId(): string {
    return this._props.userId;
  }

  get referenceId(): string | undefined {
    return this._props.referenceId;
  }

  get customCategory(): string | undefined {
    return this._props.customCategory;
  }

  static create(props: TransactionProps, id?: string) {
    const transaction = new Transaction(props, id);
    return transaction;
  }
}
