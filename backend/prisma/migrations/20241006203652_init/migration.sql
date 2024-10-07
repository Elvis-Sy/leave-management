/*
  Warnings:

  - You are about to drop the column `actionId` on the `historiques_actions` table. All the data in the column will be lost.
  - You are about to drop the `typeaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `etablId` to the `Employes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeAction` to the `historiques_Actions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `historiques_actions` DROP FOREIGN KEY `historiques_Actions_actionId_fkey`;

-- AlterTable
ALTER TABLE `employes` ADD COLUMN `etablId` INTEGER NOT NULL,
    MODIFY `dateEmbauche` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `historiques_actions` DROP COLUMN `actionId`,
    ADD COLUMN `typeAction` ENUM('Approbation', 'Refus') NOT NULL;

-- DropTable
DROP TABLE `typeaction`;

-- CreateTable
CREATE TABLE `Etablissement` (
    `idEtablissement` INTEGER NOT NULL AUTO_INCREMENT,
    `designEtablissement` VARCHAR(191) NOT NULL,
    `section` ENUM('Direction', 'Departement') NOT NULL,

    PRIMARY KEY (`idEtablissement`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employes` ADD CONSTRAINT `Employes_etablId_fkey` FOREIGN KEY (`etablId`) REFERENCES `Etablissement`(`idEtablissement`) ON DELETE RESTRICT ON UPDATE CASCADE;
