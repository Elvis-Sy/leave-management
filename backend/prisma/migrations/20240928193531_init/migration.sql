/*
  Warnings:

  - You are about to drop the column `derniereConnexion` on the `employes` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `employes` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `employes` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `employes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[compteId]` on the table `Employes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `compteId` to the `Employes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Employes_email_key` ON `employes`;

-- AlterTable
ALTER TABLE `employes` DROP COLUMN `derniereConnexion`,
    DROP COLUMN `email`,
    DROP COLUMN `password`,
    DROP COLUMN `role`,
    ADD COLUMN `compteId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Compte_Utilisateur` (
    `idCompte` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Employe', 'Manager') NOT NULL DEFAULT 'Employe',
    `derniereConnexion` DATETIME(3) NULL,
    `employeId` INTEGER NOT NULL,

    UNIQUE INDEX `Compte_Utilisateur_email_key`(`email`),
    UNIQUE INDEX `Compte_Utilisateur_employeId_key`(`employeId`),
    PRIMARY KEY (`idCompte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Employes_compteId_key` ON `Employes`(`compteId`);

-- AddForeignKey
ALTER TABLE `Compte_Utilisateur` ADD CONSTRAINT `Compte_Utilisateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employes`(`idEmploye`) ON DELETE CASCADE ON UPDATE CASCADE;
