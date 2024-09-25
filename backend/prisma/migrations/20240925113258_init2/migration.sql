-- DropForeignKey
ALTER TABLE `compte_utilisateur` DROP FOREIGN KEY `Compte_Utilisateur_employeId_fkey`;

-- AddForeignKey
ALTER TABLE `Compte_Utilisateur` ADD CONSTRAINT `Compte_Utilisateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employes`(`idEmploye`) ON DELETE CASCADE ON UPDATE CASCADE;
