import { randomUUID } from 'node:crypto';
import { Product } from '../entities/product';
import { Customer } from './customer';
import { User } from './user';
import { BottleStatus } from '@prisma/client';

export interface SaleProps {
  deliverymanId: string;
  products: Product[];
  paymentMethod: string;
  totalAmount: number;
  type: string;
  customer?: Customer;
  deliveryman?: User;
  createdAt?: Date;
  transactionId?: string;
  paid?: boolean;
}

export class Sale {
  private _customerId: string;
  private _id: string;
  private _props: SaleProps;

  constructor(customerId: string, props: SaleProps, id?: string) {
    this._customerId = customerId;
    this._id = id ?? randomUUID();
    this._props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      customer: props.customer ?? null,
      deliveryman: props.deliveryman ?? null,
    };

    // this.calculateTotal();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  get customer(): Customer {
    return this._props.customer;
  }

  set customer(value: Customer) {
    this._props.customer = value;
  }

  get deliverymanId(): string {
    return this._props.deliverymanId;
  }

  set deliverymanId(value: string) {
    this._props.deliverymanId = value;
  }

  get deliveryman(): User {
    return this._props.deliveryman;
  }

  set deliveryman(value: User) {
    this._props.deliveryman = value;
  }

  get transactionId(): string {
    return this._props.transactionId;
  }

  set transactionId(value: string) {
    this._props.transactionId = value;
  }

  get paid(): boolean {
    return this._props.paid;
  }

  set paid(value: boolean) {
    this._props.paid = value;
  }

  get products(): Product[] {
    return this._props.products;
  }

  set products(value: Product[]) {
    this._props.products = value;
    // this.calculateTotal();
  }

  get paymentMethod(): string {
    return this._props.paymentMethod;
  }

  set paymentMethod(value: string) {
    this._props.paymentMethod = value;
  }

  get totalAmount(): number {
    return this._props.totalAmount;
  }

  get type(): string {
    return this._props.type;
  }

  set type(value: string) {
    this._props.type = value;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  calculateTotal(): void {
    this._props.totalAmount = this._props.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  }

  calculateTotalUpdate(): void {
    this._props.totalAmount = this._props.products.reduce((total, product) => {
      return total + product.salePrice * product.quantity;
    }, 0);
  }

  isComodato(): boolean {
    return this._props.type === 'COMODATO';
  }

  isFull(): boolean {
    return this._props.type === 'FULL';
  }
}
