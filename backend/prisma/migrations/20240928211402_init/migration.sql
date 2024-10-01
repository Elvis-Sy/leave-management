/*
  Warnings:

  - You are about to drop the column `compteId` on the `employes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Employes_compteId_key` ON `employes`;

-- AlterTable
ALTER TABLE `employes` DROP COLUMN `compteId`;
