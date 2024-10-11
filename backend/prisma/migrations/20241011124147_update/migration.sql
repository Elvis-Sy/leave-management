-- DropForeignKey
ALTER TABLE `historiques_actions` DROP FOREIGN KEY `historiques_Actions_userId_fkey`;

-- AlterTable
ALTER TABLE `demandes_conges` MODIFY `statutId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `historiques_actions` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `historiques_Actions` ADD CONSTRAINT `historiques_Actions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Employes`(`idEmploye`) ON DELETE SET NULL ON UPDATE CASCADE;
