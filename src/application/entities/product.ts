import { ProductType, BottleStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

export interface ProductProps {
  type: ProductType;
  status: BottleStatus;
  price: number;
  quantity: number;
  productId?: string;
  salePrice?: number;
  typeSale?: BottleStatus;
}

export class Product {
  private _id: string;
  private _props: ProductProps;

  constructor(props: ProductProps, id?: string) {
    this._id = id ?? randomUUID();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get type(): ProductType {
    return this._props.type;
  }

  set type(type: ProductType) {
    this._props.type = type;
  }

  get typeSale(): BottleStatus {
    return this._props.typeSale;
  }

  set typeSale(value: BottleStatus) {
    this._props.typeSale = value;
  }

  get status(): BottleStatus {
    return this._props.status;
  }

  set status(status: BottleStatus) {
    this._props.status = status;
  }

  get price(): number {
    return this._props.price;
  }

  set price(price: number) {
    this._props.price = price;
  }

  get salePrice(): number {
    return this._props.salePrice;
  }

  set salePrice(salePrice: number) {
    this._props.salePrice = salePrice;
  }

  get productId(): string {
    return this._props.productId;
  }

  set productId(productId: string) {
    this._props.productId = productId;
  }

  get quantity(): number {
    return this._props.quantity;
  }

  set quantity(quantity: number) {
    this._props.quantity = quantity;
  }

  reduceQuantity(amount: number): void {
    if (this._props.quantity < amount) {
      throw new Error('Quantidade insuficiente');
    }
    this._props.quantity -= amount;
  }
}
