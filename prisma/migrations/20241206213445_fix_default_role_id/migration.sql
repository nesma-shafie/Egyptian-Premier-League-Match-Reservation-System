-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_id_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;
