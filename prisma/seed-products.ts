import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        type: 'P13',
        status: 'FULL',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P13',
        status: 'EMPTY',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P13',
        status: 'COMODATO',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P20',
        status: 'FULL',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P20',
        status: 'EMPTY',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P20',
        status: 'COMODATO',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P45',
        status: 'FULL',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P45',
        status: 'EMPTY',
        price: 0,
        quantity: 0,
      },
      {
        type: 'P45',
        status: 'COMODATO',
        price: 0,
        quantity: 0,
      },
    ],
  });
}

seedProducts().then(() => {
  console.log('New customers added to the database!');
});
