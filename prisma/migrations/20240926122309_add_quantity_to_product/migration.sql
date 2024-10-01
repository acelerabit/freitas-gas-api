/*
  Warnings:

  - You are about to drop the column `quantity` on the `sales` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "quantity";
