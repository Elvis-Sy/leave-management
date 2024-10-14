/*
  Warnings:

  - You are about to drop the column `description` on the `jour_ferries` table. All the data in the column will be lost.
  - Added the required column `label` to the `jour_ferries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jour_ferries` DROP COLUMN `description`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL;
