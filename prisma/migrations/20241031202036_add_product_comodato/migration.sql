-- CreateTable
CREATE TABLE "ProductComodato" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "customer_with_comodato_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductComodato_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductComodato" ADD CONSTRAINT "ProductComodato_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductComodato" ADD CONSTRAINT "ProductComodato_customer_with_comodato_id_fkey" FOREIGN KEY ("customer_with_comodato_id") REFERENCES "CustomerWithComodato"("id") ON DELETE SET NULL ON UPDATE CASCADE;
