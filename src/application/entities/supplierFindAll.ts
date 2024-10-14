import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

export interface SimpleDebtProps {
  id: string;
  amount: number;
  dueDate: Date;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
  supplierId: string;
}

export interface SupplierProps {
  name: string;
  email: string;
  phone: string;
}

export class SupplierFindAll {
  private _id: string;
  private props: SupplierProps;
  private _debts: SimpleDebtProps[];

  constructor(
    props: Replace<SupplierProps, { createdAt?: Date; updatedAt?: Date }>,
    debts: SimpleDebtProps[] = [],
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
    };
    this._debts = debts;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get email(): string {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get phone(): string {
    return this.props.phone;
  }

  public set phone(phone: string) {
    this.props.phone = phone;
  }

  public get debts(): SimpleDebtProps[] {
    return this._debts;
  }
}
