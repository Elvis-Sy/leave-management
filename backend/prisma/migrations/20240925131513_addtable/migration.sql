/*
  Warnings:

  - Added the required column `posteId` to the `Employes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employes` ADD COLUMN `posteId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Postes` (
    `idPoste` INTEGER NOT NULL AUTO_INCREMENT,
    `designPoste` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idPoste`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `demandes_conges` (
    `idDemande` INTEGER NOT NULL AUTO_INCREMENT,
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NOT NULL,
    `dateEnvoie` DATETIME(3) NOT NULL,
    `employeId` INTEGER NOT NULL,
    `typeId` INTEGER NOT NULL,
    `statutId` INTEGER NOT NULL,

    UNIQUE INDEX `demandes_conges_employeId_key`(`employeId`),
    PRIMARY KEY (`idDemande`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `types_conges` (
    `idType` INTEGER NOT NULL AUTO_INCREMENT,
    `designType` VARCHAR(191) NOT NULL,
    `nbJours` INTEGER NOT NULL,

    PRIMARY KEY (`idType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statut_demande` (
    `idStatut` INTEGER NOT NULL AUTO_INCREMENT,
    `designStatut` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStatut`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historiques_conges` (
    `idHistorique` INTEGER NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(191) NOT NULL,
    `ancienneValeur` VARCHAR(191) NOT NULL,
    `nouvelleValeur` VARCHAR(191) NOT NULL,
    `dateChange` DATETIME(3) NOT NULL,
    `demandeId` INTEGER NOT NULL,

    PRIMARY KEY (`idHistorique`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jour_ferries` (
    `idJour` INTEGER NOT NULL AUTO_INCREMENT,
    `dateFeriee` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idJour`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `soldes_conges` (
    `soldeTotal` INTEGER NOT NULL,
    `soldeUtilise` INTEGER NOT NULL,
    `idEmp` INTEGER NOT NULL,
    `idType` INTEGER NOT NULL,

    PRIMARY KEY (`idEmp`, `idType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employes` ADD CONSTRAINT `Employes_posteId_fkey` FOREIGN KEY (`posteId`) REFERENCES `Postes`(`idPoste`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demandes_conges` ADD CONSTRAINT `demandes_conges_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employes`(`idEmploye`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demandes_conges` ADD CONSTRAINT `demandes_conges_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `types_conges`(`idType`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demandes_conges` ADD CONSTRAINT `demandes_conges_statutId_fkey` FOREIGN KEY (`statutId`) REFERENCES `statut_demande`(`idStatut`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiques_conges` ADD CONSTRAINT `historiques_conges_demandeId_fkey` FOREIGN KEY (`demandeId`) REFERENCES `demandes_conges`(`idDemande`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soldes_conges` ADD CONSTRAINT `soldes_conges_idEmp_fkey` FOREIGN KEY (`idEmp`) REFERENCES `Employes`(`idEmploye`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soldes_conges` ADD CONSTRAINT `soldes_conges_idType_fkey` FOREIGN KEY (`idType`) REFERENCES `types_conges`(`idType`) ON DELETE RESTRICT ON UPDATE CASCADE;
