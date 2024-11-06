import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

export interface BankAccountProps {
  bank: string;
  paymentsAssociated?: string[];
  createdAt: Date;
}

export class BankAccount {
  private _id: string;
  private props: BankAccountProps;

  constructor(
    props: Replace<BankAccountProps, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      paymentsAssociated: props.paymentsAssociated ?? [],
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get bank(): string {
    return this.props.bank;
  }

  public set bank(bank: string) {
    this.props.bank = bank;
  }

  public get paymentsAssociated(): string[] {
    return this.props.paymentsAssociated;
  }

  public set paymentsAssociated(paymentsAssociated: string[]) {
    this.props.paymentsAssociated = paymentsAssociated;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Replace<BankAccountProps, { createdAt?: Date; }>,
    id?: string,
  ) {
    return new BankAccount(props, id);
  }
}
