import { CustomersRepository } from '../../repositories/customer-repository';
import { Customer } from '../../entities/customer';

export class FindCustomerByIdUseCase {
  static async execute(
    customersRepository: CustomersRepository,
    id: string
  ): Promise<Customer | null> {
    return customersRepository.findById(id);
  }
}
