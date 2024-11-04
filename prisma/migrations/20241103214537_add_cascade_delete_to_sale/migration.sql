-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_transactionId_fkey";

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
