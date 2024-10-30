-- CreateTable
CREATE TABLE "Collect" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collect_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collect" ADD CONSTRAINT "Collect_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
