import { Product } from '../entities/product';
import { Customer } from './customer';
import { User } from './user';
export class Sale {
  private _customerId: string;
  private _deliverymanId: string;
  private _products: Product[];
  private _paymentMethod: string;
  private _totalAmount: number;
  private _type: string;
  private _customer?: Customer;
  private _deliveryman?: User;
  private _createdAt?: Date;

  constructor(
    customerId: string,
    deliverymanId: string,
    products: Product[],
    paymentMethod: string,
    totalAmount: number,
    type: string,
    customer?: Customer,
    deliveryman?: User,
    createdAt?: Date,
  ) {
    this._customerId = customerId;
    this._deliverymanId = deliverymanId;
    this._products = products;
    this._paymentMethod = paymentMethod;
    this._totalAmount = totalAmount;
    this._type = type;
    this._customer = customer ?? null;
    this._deliveryman = deliveryman ?? null;
    this._createdAt = createdAt ?? new Date();
    this.calculateTotal();
  }

  get customerId(): string {
    return this._customerId;
  }

  get deliverymanId(): string {
    return this._deliverymanId;
  }

  get customer(): Customer {
    return this._customer;
  }

  get deliveryman(): User {
    return this._deliveryman;
  }

  get products(): Product[] {
    return this._products;
  }

  get paymentMethod(): string {
    return this._paymentMethod;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get type(): string {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  setCustomerId(value: string): void {
    this._customerId = value;
  }

  setDeliverymanId(value: string): void {
    this._deliverymanId = value;
  }

  setProducts(value: Product[]): void {
    this._products = value;
    this.calculateTotal();
  }

  setPaymentMethod(value: string): void {
    this._paymentMethod = value;
  }

  setTotalAmount(value: number): void {
    this._totalAmount = value;
  }

  setType(value: string): void {
    this._type = value;
  }

  private calculateTotal(): void {
    this._totalAmount = this._products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  }

  isComodato(): boolean {
    return this._type === 'COMODATO';
  }

  isFull(): boolean {
    return this._type === 'FULL';
  }
}
