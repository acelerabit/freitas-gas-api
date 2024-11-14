import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { BankAccount } from '@prisma/client';

export interface AccountTransferProps {
  originAccountId?: string;
  destinationAccountId?: string;
  originAccount?: BankAccount;
  destinationAccount?: BankAccount;
  type?: 'caixa';
  value: number;
  createdAt: Date;
}

export class AccountTransfer {
  private _id: string;
  private props: AccountTransferProps;

  constructor(
    props: Replace<
      AccountTransferProps,
      { createdAt?: Date; updatedAt?: Date }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get value(): number {
    return this.props.value;
  }

  public set value(value: number) {
    this.props.value = value;
  }

  public get type(): 'caixa' {
    return this.props.type;
  }

  public set type(type: 'caixa') {
    this.props.type = type;
  }

  public get originAccountId(): string {
    return this.props.originAccountId;
  }

  public set originAccountId(originAccountId: string) {
    this.props.originAccountId = originAccountId;
  }

  public get destinationAccountId(): string {
    return this.props.destinationAccountId;
  }

  public set destinationAccountId(destinationAccountId: string) {
    this.props.destinationAccountId = destinationAccountId;
  }

  public get originAccount(): BankAccount {
    return this.props.originAccount;
  }

  public set originAccount(originAccount: BankAccount) {
    this.props.originAccount = originAccount;
  }

  public get destinationAccount(): BankAccount {
    return this.props.destinationAccount;
  }

  public set destinationAccount(destinationAccount: BankAccount) {
    this.props.destinationAccount = destinationAccount;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Replace<AccountTransferProps, { createdAt?: Date }>,
    id?: string,
  ) {
    return new AccountTransfer(props, id);
  }
}
