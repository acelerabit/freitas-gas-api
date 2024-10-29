import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

export interface IncomeTypeProps {
  name: string;
}

export class IncomeType {
  private _id: string;
  private props: IncomeTypeProps;

  constructor(
    props: Replace<IncomeTypeProps, { createdAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
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
  }

  static create(
    props: Replace<IncomeTypeProps, { createdAt?: Date }>,
    id?: string,
  ) {
    const incomeType = new IncomeType(props, id);

    return incomeType;
  }
}
