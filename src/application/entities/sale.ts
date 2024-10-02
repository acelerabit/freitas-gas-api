import { Product } from '../entities/product';

export interface SaleProps {
  deliverymanId: string;
  products: Product[];
  paymentMethod: string;
  totalAmount: number;
  type: string;
}

export class Sale {
  private _customerId: string;
  private _props: SaleProps;

  constructor(customerId: string, props: SaleProps) {
    this._customerId = customerId;
    this._props = props;
    this.calculateTotal();
  }

  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  get deliverymanId(): string {
    return this._props.deliverymanId;
  }

  set deliverymanId(value: string) {
    this._props.deliverymanId = value;
  }

  get products(): Product[] {
    return this._props.products;
  }

  set products(value: Product[]) {
    this._props.products = value;
    this.calculateTotal();
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

  private calculateTotal(): void {
    this._props.totalAmount = this._props.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  }

  isComodato(): boolean {
    return this._props.type === 'COMODATO';
  }

  isFull(): boolean {
    return this._props.type === 'FULL';
  }
}
