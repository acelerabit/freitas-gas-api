import { Supplier, SupplierProps } from './supplier';
import { Debt, DebtProps } from './dept';
import { Replace } from './../../helpers/Replace';

export interface SupplierWithDebtsProps extends SupplierProps {
  id: string;
  debts: DebtProps[];
}

export class SupplierWithDebts extends Supplier {
  private _debts: Debt[];

  constructor(
    props: Replace<
      SupplierWithDebtsProps,
      { createdAt?: Date; updatedAt?: Date }
    >,
    id?: string,
  ) {
    super(props, id);
    this._debts = props.debts.map((debt) => new Debt(debt));
  }

  public get debts(): Debt[] {
    return this._debts;
  }

  public set debts(debts: Debt[]) {
    this._debts = debts;
  }
}
