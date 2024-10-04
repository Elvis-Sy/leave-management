-- AlterTable
ALTER TABLE `compte_utilisateur` MODIFY `role` ENUM('Employe', 'Manager', 'Admin') NOT NULL DEFAULT 'Employe',
    MODIFY `employeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `employes` ADD COLUMN `photoProfile` VARCHAR(191) NULL;
