/*
  Warnings:

  - Made the column `matricule` on table `employes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `employes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `employes` MODIFY `matricule` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
