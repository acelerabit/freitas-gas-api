import { Replace } from '@/helpers/Replace';
import { TransactionType, TransactionCategory } from '@prisma/client';
import { randomUUID } from 'crypto';

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

  get createdAt(): Date {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
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
