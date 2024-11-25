/*
  Warnings:

  - A unique constraint covering the columns `[matricule]` on the table `Employes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `employes` ADD COLUMN `matricule` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employes_matricule_key` ON `Employes`(`matricule`);
