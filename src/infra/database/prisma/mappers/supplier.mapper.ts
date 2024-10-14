import { Supplier } from '@/application/entities/supplier';
import { SupplierWithDebts } from '@/application/entities/supplierWithDebts';
import { SupplierFindAll } from '@/application/entities/supplierFindAll';
import { Prisma } from '@prisma/client';

export class PrismaSuppliersMapper {
  static toDomain(supplier: any): Supplier {
    return new Supplier(
      {
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
      },
      supplier.id,
    );
  }

  static toDomainWithDebts(supplier: any): SupplierWithDebts {
    return new SupplierWithDebts({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      debts: supplier.debts.map((debt: any) => ({
        id: debt.id,
        amount: debt.amount,
        dueDate: debt.dueDate,
        paid: debt.paid,
        createdAt: debt.createdAt,
        updatedAt: debt.updatedAt,
        supplierId: supplier.id,
      })),
    });
  }

  static toFindAll(supplier: any): SupplierFindAll {
    const debts = supplier.debts.map((debt: any) => ({
      id: debt.id,
      amount: debt.amount,
      dueDate: debt.dueDate,
      paid: debt.paid,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
      supplierId: supplier.id,
    }));

    return new SupplierFindAll(
      {
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
      },
      debts,
      supplier.id,
    );
  }
}
