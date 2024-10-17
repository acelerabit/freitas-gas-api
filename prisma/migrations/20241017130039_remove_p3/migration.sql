/*
  Warnings:

  - The values [P3] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;

-- Excluir todos os registros que utilizam o valor "P3"
DELETE FROM "products"
WHERE "type" = 'P3';

-- Criar novo tipo de enum sem o valor "P3"
CREATE TYPE "ProductType_new" AS ENUM ('P13', 'P20', 'P45');

-- Alterar a coluna "type" da tabela "products" para usar o novo enum
ALTER TABLE "products" ALTER COLUMN "type" TYPE "ProductType_new" USING ("type"::text::"ProductType_new");

-- Renomear o antigo tipo de enum
ALTER TYPE "ProductType" RENAME TO "ProductType_old";

-- Renomear o novo tipo para o nome original
ALTER TYPE "ProductType_new" RENAME TO "ProductType";

-- Excluir o tipo de enum antigo
DROP TYPE "ProductType_old";

COMMIT;