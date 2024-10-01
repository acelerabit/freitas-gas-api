import { ProductType, BottleStatus } from '@prisma/client';
export class Product {
  private _id: string;
  private _type: ProductType;
  private _status: BottleStatus;
  private _price: number;
  private _quantity: number;

  constructor(
    id: string,
    type: ProductType,
    status: BottleStatus,
    price: number,
    quantity: number,
  ) {
    this._id = id;
    this._type = type;
    this._status = status;
    this._price = price;
    this._quantity = quantity;
  }

  get id(): string {
    return this._id;
  }

  get type(): ProductType {
    return this._type;
  }

  get status(): BottleStatus {
    return this._status;
  }

  get price(): number {
    return this._price;
  }

  get quantity(): number {
    return this._quantity;
  }

  reduceQuantity(amount: number): void {
    if (this._quantity < amount) {
      throw new Error('Quantidade insuficiente');
    }
    this._quantity -= amount;
  }
}
