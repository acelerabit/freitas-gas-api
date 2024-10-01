/*
  Warnings:

  - You are about to drop the column `product_id` on the `sales` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_product_id_fkey";

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "product_id";

-- CreateTable
CREATE TABLE "sales_products" (
    "id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "sales_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sales_products" ADD CONSTRAINT "sales_products_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_products" ADD CONSTRAINT "sales_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
