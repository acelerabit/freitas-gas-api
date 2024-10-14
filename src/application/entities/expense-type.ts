import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

export interface ExpenseTypeProps {
  name: string;
}

export class ExpenseType {
  private _id: string;
  private props: ExpenseTypeProps;

  constructor(
    props: Replace<ExpenseTypeProps, { createdAt?: Date }>,
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
    props: Replace<ExpenseTypeProps, { createdAt?: Date }>,
    id?: string,
  ) {
    const expenseType = new ExpenseType(props, id);

    return expenseType;
  }
}
