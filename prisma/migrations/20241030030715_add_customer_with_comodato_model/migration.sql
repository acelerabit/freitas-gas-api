-- CreateTable
CREATE TABLE "CustomerWithComodato" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerWithComodato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerWithComodato_customer_id_key" ON "CustomerWithComodato"("customer_id");

-- AddForeignKey
ALTER TABLE "CustomerWithComodato" ADD CONSTRAINT "CustomerWithComodato_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
