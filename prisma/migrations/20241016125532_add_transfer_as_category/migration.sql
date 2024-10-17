-- AlterEnum
ALTER TYPE "TransactionCategory" ADD VALUE 'TRANSFER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountAmount" INTEGER DEFAULT 0;
