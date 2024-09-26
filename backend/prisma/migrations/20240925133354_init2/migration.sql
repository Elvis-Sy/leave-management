/*
  Warnings:

  - Added the required column `typeStatut` to the `statut_demande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `statut_demande` ADD COLUMN `typeStatut` ENUM('Histo', 'DM') NOT NULL;
