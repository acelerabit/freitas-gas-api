import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { User } from './user';

export interface CollectProps {
  customerId: string;
  customer?: User;
  quantity: number;
  createdAt: Date;
}

export class Collect {
  private _id: string;
  private props: CollectProps;

  constructor(
    props: Replace<CollectProps, { createdAt?: Date; updatedAt?: Date }>,
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

  public get customerId(): string {
    return this.props.customerId;
  }

  public set customerId(customerId: string) {
    this.props.customerId = customerId;
  }

  public get customer(): User {
    return this.props.customer;
  }

  public set customer(customer: User) {
    this.props.customer = customer;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public set quantity(quantity: number) {
    this.props.quantity = quantity;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Replace<CollectProps, { createdAt?: Date; }>,
    id?: string,
  ) {
    return new Collect(props, id);
  }
}
