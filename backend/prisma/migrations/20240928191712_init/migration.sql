-- CreateTable
CREATE TABLE `Employes` (
    `idEmploye` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NULL,
    `sexe` CHAR(2) NOT NULL,
    `CIN` INTEGER NOT NULL,
    `dateEmbauche` DATETIME(3) NOT NULL,
    `periodeEssai` BOOLEAN NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Employe', 'Manager') NOT NULL DEFAULT 'Employe',
    `derniereConnexion` DATETIME(3) NULL,
    `idManager` INTEGER NULL,
    `posteId` INTEGER NOT NULL,

    UNIQUE INDEX `Employes_email_key`(`email`),
    INDEX `Employes_nom_idx`(`nom`),
    INDEX `Employes_idManager_idx`(`idManager`),
    PRIMARY KEY (`idEmploye`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `dateEnvoie` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateConfirmation` DATETIME(3) NULL,
    `employeId` INTEGER NOT NULL,
    `typeId` INTEGER NOT NULL,
    `statutId` INTEGER NOT NULL,

    INDEX `demandes_conges_dateDebut_dateFin_idx`(`dateDebut`, `dateFin`),
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
CREATE TABLE `historiques_Actions` (
    `idHistorique` INTEGER NOT NULL AUTO_INCREMENT,
    `ancienneValeur` VARCHAR(191) NULL,
    `nouvelleValeur` VARCHAR(191) NULL,
    `dateAction` DATETIME(3) NOT NULL,
    `niveau` VARCHAR(191) NOT NULL,
    `actionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

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

    UNIQUE INDEX `soldes_conges_idEmp_idType_key`(`idEmp`, `idType`),
    PRIMARY KEY (`idEmp`, `idType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeAction` (
    `idTypeAction` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idTypeAction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DemandeJourFerie` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DemandeJourFerie_AB_unique`(`A`, `B`),
    INDEX `_DemandeJourFerie_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employes` ADD CONSTRAINT `Employes_idManager_fkey` FOREIGN KEY (`idManager`) REFERENCES `Employes`(`idEmploye`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employes` ADD CONSTRAINT `Employes_posteId_fkey` FOREIGN KEY (`posteId`) REFERENCES `Postes`(`idPoste`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demandes_conges` ADD CONSTRAINT `demandes_conges_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employes`(`idEmploye`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demandes_conges` ADD CONSTRAINT `demandes_conges_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `types_conges`(`idType`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demandes_conges` ADD CONSTRAINT `demandes_conges_statutId_fkey` FOREIGN KEY (`statutId`) REFERENCES `statut_demande`(`idStatut`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiques_Actions` ADD CONSTRAINT `historiques_Actions_actionId_fkey` FOREIGN KEY (`actionId`) REFERENCES `TypeAction`(`idTypeAction`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiques_Actions` ADD CONSTRAINT `historiques_Actions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Employes`(`idEmploye`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soldes_conges` ADD CONSTRAINT `soldes_conges_idEmp_fkey` FOREIGN KEY (`idEmp`) REFERENCES `Employes`(`idEmploye`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soldes_conges` ADD CONSTRAINT `soldes_conges_idType_fkey` FOREIGN KEY (`idType`) REFERENCES `types_conges`(`idType`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DemandeJourFerie` ADD CONSTRAINT `_DemandeJourFerie_A_fkey` FOREIGN KEY (`A`) REFERENCES `demandes_conges`(`idDemande`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DemandeJourFerie` ADD CONSTRAINT `_DemandeJourFerie_B_fkey` FOREIGN KEY (`B`) REFERENCES `jour_ferries`(`idJour`) ON DELETE CASCADE ON UPDATE CASCADE;
