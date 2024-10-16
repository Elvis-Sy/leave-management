/*
  Warnings:

  - You are about to alter the column `soldeTotal` on the `soldes_conges` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,1)`.

*/
-- AlterTable
ALTER TABLE `soldes_conges` MODIFY `soldeTotal` DECIMAL(10, 1) NOT NULL;
