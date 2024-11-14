-- CreateTable
CREATE TABLE "account_transfers" (
    "id" TEXT NOT NULL,
    "originAccountId" TEXT,
    "destinationAccountId" TEXT,
    "value" INTEGER NOT NULL,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_transfers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "account_transfers" ADD CONSTRAINT "account_transfers_originAccountId_fkey" FOREIGN KEY ("originAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transfers" ADD CONSTRAINT "account_transfers_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
