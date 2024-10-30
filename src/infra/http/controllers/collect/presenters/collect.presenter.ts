import { Collect } from '@/application/entities/collect';

export class CollectsPresenters {
  static toHTTP(collect: Collect) {
    return {
      id: collect.id,
      customer: {
        name: collect.customer.name
      },
      quantity: collect.quantity,
      createdAt: collect.createdAt
    };
  }
}
