import { TransactionType, TransactionCategory } from '@prisma/client';

export class Transaction {
  private _amount: number;
  private _transactionType: TransactionType;
  private _mainAccount: boolean;
  private _category: TransactionCategory;
  private _userId: string;
  private _referenceId?: string;
  private _customCategory?: string;

  constructor(
    amount: number,
    transactionType: TransactionType,
    mainAccount: boolean,
    category: TransactionCategory,
    userId: string,
    referenceId?: string,
    customCategory?: string,
  ) {
    this._amount = amount;
    this._transactionType = transactionType;
    this._mainAccount = mainAccount;
    this._category = category;
    this._userId = userId;
    this._referenceId = referenceId;
    this._customCategory = customCategory;
  }

  get amount(): number {
    return this._amount;
  }

  get transactionType(): TransactionType {
    return this._transactionType;
  }

  get mainAccount(): boolean {
    return this._mainAccount;
  }

  get category(): TransactionCategory {
    return this._category;
  }

  get userId(): string {
    return this._userId;
  }

  get referenceId(): string | undefined {
    return this._referenceId;
  }

  get customCategory(): string | undefined {
    return this._customCategory;
  }
}
