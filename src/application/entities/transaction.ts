import { TransactionType, TransactionCategory } from '@prisma/client';

export interface TransactionProps {
  transactionType: TransactionType;
  mainAccount: boolean;
  category: TransactionCategory;
  userId: string;
  referenceId?: string;
  customCategory?: string;
}

export class Transaction {
  private _amount: number;
  private _props: TransactionProps;

  constructor(amount: number, props: TransactionProps) {
    this._amount = amount;
    this._props = props;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
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

  get userId(): string {
    return this._props.userId;
  }

  get referenceId(): string | undefined {
    return this._props.referenceId;
  }

  get customCategory(): string | undefined {
    return this._props.customCategory;
  }
}
