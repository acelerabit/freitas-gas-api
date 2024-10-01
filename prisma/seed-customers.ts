import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCustomers() {
  await prisma.customer.createMany({
    data: [
      {
        name: 'Cliente Genérico',
        email: 'cliente@generico.com',
        phone: '1234567890',
        street: 'Rua dos Testes',
        number: '123',
        district: 'Bairro Central',
        city: 'Cidade Exemplo',
        state: 'Estado Teste',
        creditBalance: 0,
      },
    ],
  });
}

seedCustomers().then(() => {
  console.log('New customers added to the database!');
});
