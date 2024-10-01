/*
  Warnings:

  - Made the column `compteId` on table `employes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `employes` MODIFY `compteId` INTEGER NOT NULL;
