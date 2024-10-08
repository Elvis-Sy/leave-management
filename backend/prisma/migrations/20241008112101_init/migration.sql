/*
  Warnings:

  - A unique constraint covering the columns `[CIN]` on the table `Employes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `employes` MODIFY `CIN` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employes_CIN_key` ON `Employes`(`CIN`);
