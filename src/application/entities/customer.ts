import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { PrismaCustomersMapper } from '@/infra/database/prisma/mappers/customer.mapper';

export interface CustomerProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  number?: string;
  district: string;
  city: string;
  state: string;
  creditBalance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer {
  private _id: string;
  private props: CustomerProps;

  constructor(
    props: Replace<CustomerProps, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? props.id ?? randomUUID();
    this.props = {
      ...props,
      id: this._id,
      creditBalance: props.creditBalance ?? 0,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
    this.updateTimestamp();
  }

  public get email(): string {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
    this.updateTimestamp();
  }

  public get phone(): string {
    return this.props.phone;
  }

  public set phone(phone: string) {
    this.props.phone = phone;
    this.updateTimestamp();
  }

  public get street(): string {
    return this.props.street;
  }

  public set street(street: string) {
    this.props.street = street;
    this.updateTimestamp();
  }

  public get number(): string {
    return this.props.number;
  }

  public set number(number: string) {
    this.props.number = number;
    this.updateTimestamp();
  }

  public get district(): string {
    return this.props.district;
  }

  public set district(district: string) {
    this.props.district = district;
    this.updateTimestamp();
  }

  public get city(): string {
    return this.props.city;
  }

  public set city(city: string) {
    this.props.city = city;
    this.updateTimestamp();
  }

  public get state(): string {
    return this.props.state;
  }

  public set state(state: string) {
    this.props.state = state;
    this.updateTimestamp();
  }

  public get creditBalance(): number {
    return this.props.creditBalance;
  }

  public set creditBalance(creditBalance: number) {
    this.props.creditBalance = creditBalance;
    this.updateTimestamp();
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private updateTimestamp() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Replace<CustomerProps, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    return new Customer(props, id);
  }
}
