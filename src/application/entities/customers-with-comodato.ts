import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { User } from './user';

export interface CustomerWithComodatoProps {
  customerId: string;
  user?: User;
  quantity: number;
  createdAt: Date;
}

export class CustomerWithComodato {
  private _id: string;
  private props: CustomerWithComodatoProps;

  constructor(
    props: Replace<CustomerWithComodatoProps, { createdAt?: Date; updatedAt?: Date }>,
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

  public get user(): User {
    return this.props.user;
  }

  public set user(user: User) {
    this.props.user = user;
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
    props: Replace<CustomerWithComodatoProps, { createdAt?: Date; }>,
    id?: string,
  ) {
    return new CustomerWithComodato(props, id);
  }
}
