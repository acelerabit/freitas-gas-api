import { CustomersRepository } from '../../repositories/customer-repository';

export class DeleteCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(id: string): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
