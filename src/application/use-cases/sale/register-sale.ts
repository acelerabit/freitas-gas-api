import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Sale } from '../../entities/sale';
import { Transaction } from '../../entities/transaction';
import { TransactionType, TransactionCategory } from '@prisma/client';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { BottleStatus } from '@prisma/client';
import { UsersRepository } from '@/application/repositories/user-repository';

@Injectable()
export class RegisterSaleUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly customerRepository: CustomersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(sale: Sale): Promise<void> {
    const customer = await this.customerRepository.findById(sale.customerId);
    const isComodato = sale.products.some(
      (product) => product.status === BottleStatus.COMODATO,
    );

    if (isComodato && customer.name === 'Cliente Genérico') {
      throw new Error(
        'Não é permitido utilizar o cliente "Cliente Genérico" para vendas em comodato.',
      );
    }

    const deliveryman = await this.usersRepository.findById(sale.deliverymanId);

    if (!deliveryman) {
      throw new Error('Entregador não encontrado');
    }

    const saleWithCustomerId = new Sale(sale.customerId, {
      deliverymanId: sale.deliverymanId,
      paymentMethod: sale.paymentMethod,
      products: sale.products,
      totalAmount: sale.totalAmount,
      type: sale.type,
      customer: customer,
      deliveryman: deliveryman,
    });

    if (saleWithCustomerId.isComodato() || saleWithCustomerId.isFull()) {
      for (const product of saleWithCustomerId.products) {
        await this.salesRepository.updateStock(product.id, -product.quantity);
      }
    }

    saleWithCustomerId.calculateTotal();

    const saleId = await this.salesRepository.createSale(saleWithCustomerId);

    const saleProducts = saleWithCustomerId.products.map((product) => ({
      id: product.id,
      salePrice: product.price,
      quantity: product.quantity,
    }));

    await this.salesRepository.createSalesProducts(saleId, saleProducts);

    const transaction = new Transaction({
      amount: saleWithCustomerId.totalAmount,
      transactionType: TransactionType.EXIT,
      mainAccount: false,
      category: TransactionCategory.SALE,
      userId: saleWithCustomerId.deliverymanId,
      referenceId: saleId,
    });

    await this.transactionRepository.createTransaction(transaction);

    saleWithCustomerId.transactionId = transaction.id;
    saleWithCustomerId.deliverymanId = transaction.userId;

    await this.salesRepository.update(saleWithCustomerId);

    if (saleWithCustomerId.isComodato()) {
      this.generateComodatoTerm(saleWithCustomerId);
    }
  }

  private generateComodatoTerm(sale: Sale): void {
    console.log(`Gerar termo de comodato para o cliente ${sale.customerId}`);
  }
}
