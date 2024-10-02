import { Customer } from '@/application/entities/customer';

export class CustomersPresenters {
  static toHTTP(customer: Customer) {
    return {
      id: customer.id,
      name: customer.name,
    };
  }
}
