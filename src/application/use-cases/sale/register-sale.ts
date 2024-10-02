import { Injectable } from '@nestjs/common';
import { SalesRepository } from '../../repositories/sales-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { Sale } from '../../entities/sale';
import { Transaction } from '../../entities/transaction';
import { TransactionType, TransactionCategory } from '@prisma/client';
import { CustomersRepository } from '@/application/repositories/customer-repository';
import { BottleStatus } from '@prisma/client';

@Injectable()
export class RegisterSaleUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly customerRepository: CustomersRepository,
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

    const saleWithCustomerId = new Sale(sale.customerId, {
      deliverymanId: sale.deliverymanId,
      products: sale.products,
      paymentMethod: sale.paymentMethod,
      totalAmount: sale.totalAmount,
      type: sale.type,
    });

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

    const transaction = new Transaction(saleWithCustomerId.totalAmount, {
      transactionType: TransactionType.EXIT,
      mainAccount: false,
      category: TransactionCategory.SALE,
      userId: saleWithCustomerId.deliverymanId,
      referenceId: saleId,
    });

    await this.transactionRepository.createTransaction(transaction);

    if (saleWithCustomerId.isComodato()) {
      this.generateComodatoTerm(saleWithCustomerId);
    }
  }

  private generateComodatoTerm(sale: Sale): void {
    console.log(`Gerar termo de comodato para o cliente ${sale.customerId}`);
  }
}
