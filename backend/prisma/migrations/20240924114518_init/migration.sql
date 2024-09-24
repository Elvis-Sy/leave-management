-- CreateTable
CREATE TABLE `Employes` (
    `idEmploye` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NULL,
    `sexe` CHAR(2) NOT NULL,
    `CIN` INTEGER NOT NULL,
    `dateEmbauche` DATETIME(3) NOT NULL,
    `periodeEssai` BOOLEAN NOT NULL,
    `idManager` INTEGER NULL,

    PRIMARY KEY (`idEmploye`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Compte_Utilisateur` (
    `idCompte` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Employe', 'Manager') NOT NULL DEFAULT 'Employe',
    `derniereConnexion` DATETIME(3) NOT NULL,
    `employeId` INTEGER NOT NULL,

    UNIQUE INDEX `Compte_Utilisateur_email_key`(`email`),
    PRIMARY KEY (`idCompte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employes` ADD CONSTRAINT `Employes_idManager_fkey` FOREIGN KEY (`idManager`) REFERENCES `Employes`(`idEmploye`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compte_Utilisateur` ADD CONSTRAINT `Compte_Utilisateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employes`(`idEmploye`) ON DELETE RESTRICT ON UPDATE CASCADE;
