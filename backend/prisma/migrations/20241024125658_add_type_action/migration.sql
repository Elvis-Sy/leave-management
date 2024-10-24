-- AlterTable
ALTER TABLE `historiques_actions` MODIFY `typeAction` ENUM('Approbation', 'Refus', 'Annulation') NOT NULL;
