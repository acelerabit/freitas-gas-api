import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

export interface DebtProps {
  amount: number;
  dueDate: Date;
  paid: boolean;
  supplierId: string;
  bankAccountId?: string;
}

export class Debt {
  private _id: string;
  private props: DebtProps;

  constructor(
    props: Replace<DebtProps, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
    };
  }

  public get id(): string {
    return this._id;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public set amount(amount: number) {
    this.props.amount = amount;
  }

  public get dueDate(): Date {
    return this.props.dueDate;
  }

  public set dueDate(dueDate: Date) {
    this.props.dueDate = dueDate;
  }

  public get paid(): boolean {
    return this.props.paid;
  }

  public set paid(paid: boolean) {
    this.props.paid = paid;
  }

  public get bankAccountId(): string {
    return this.props.bankAccountId;
  }

  public set bankAccountId(bankAccountId: string) {
    this.props.bankAccountId = bankAccountId;
  }

  public get supplierId(): string {
    return this.props.supplierId;
  }
}
