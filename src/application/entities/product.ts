export class Product {
  private _id: string;
  private _name: string;
  private _price: number;
  private _quantity: number;

  constructor(id: string, name: string, price: number, quantity: number) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._quantity = quantity;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
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
