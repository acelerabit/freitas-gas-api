import { Replace } from '@/helpers/Replace';
import { randomUUID } from 'crypto';

export interface ProductComodatoProps {
  quantity: number;
  productId?: string;
  createdAt: Date;
}

export class ProductComodato {
  private _id: string;
  private _props: ProductComodatoProps;

  constructor(
    props: Replace<ProductComodatoProps, { createdAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this._props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id(): string {
    return this._id;
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

  get createdAt(): Date {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  static create(
    props: Replace<ProductComodatoProps, { createdAt?: Date }>,
    id?: string,
  ) {
    return new ProductComodato(props, id);
  }
}
