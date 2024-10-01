import { Product } from '../entities/product';
export class Sale {
  private _customerId: string;
  private _deliverymanId: string;
  private _products: Product[];
  private _paymentMethod: string;
  private _totalAmount: number;
  private _type: string;

  constructor(
    customerId: string,
    deliverymanId: string,
    products: Product[],
    paymentMethod: string,
    totalAmount: number,
    type: string,
  ) {
    this._customerId = customerId;
    this._deliverymanId = deliverymanId;
    this._products = products;
    this._paymentMethod = paymentMethod;
    this._totalAmount = totalAmount;
    this._type = type;
    this.calculateTotal();
  }

  get customerId(): string {
    return this._customerId;
  }

  get deliverymanId(): string {
    return this._deliverymanId;
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
