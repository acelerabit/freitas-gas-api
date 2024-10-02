import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Sale } from '../../entities/sale';
import { Transaction } from '../../entities/transaction';
import { TransactionType, TransactionCategory } from '@prisma/client';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { UsersRepository } from '@/application/repositories/user-repository';

@Injectable()
export class RegisterSaleUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly customerRepository: CustomersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(sale: Sale) {
    const customerId = sale.customerId;

    const customer = await this.customerRepository.findById(customerId);
    if (sale.isComodato() && customer.name === 'Cliente Genérico') {
      throw new Error(
        'Não é permitido utilizar o cliente "Cliente Genérico" para vendas em comodato.',
      );
    }

    const deliverymanId = sale.deliverymanId;

    const deliveryman = await this.usersRepository.findById(deliverymanId);

    if (!deliveryman) {
      throw new Error('Entrregador não encontrado');
    }

    const saleWithCustomerId = new Sale(
      customerId,
      sale.deliverymanId,
      sale.products,
      sale.paymentMethod,
      sale.totalAmount,
      sale.type,
      customer,
      deliveryman,
    );

    if (saleWithCustomerId.isComodato() || saleWithCustomerId.isFull()) {
      for (const product of saleWithCustomerId.products) {
        await this.salesRepository.updateStock(product.id, -product.quantity);
      }
    }

    const saleId = await this.salesRepository.createSale(saleWithCustomerId);

    const saleProducts = saleWithCustomerId.products.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));

    await this.salesRepository.createSalesProducts(saleId, saleProducts);

    const transaction = new Transaction(
      saleWithCustomerId.totalAmount,
      TransactionType.EXIT,
      false,
      TransactionCategory.SALE,
      saleWithCustomerId.deliverymanId,
      saleId,
    );

    await this.transactionRepository.createTransaction(transaction);

    if (saleWithCustomerId.isComodato()) {
      this.generateComodatoTerm(saleWithCustomerId);
    }
  }

  private generateComodatoTerm(sale: Sale) {
    console.log(`Gerar termo de comodato para o cliente ${sale.customerId}`);
  }
}
