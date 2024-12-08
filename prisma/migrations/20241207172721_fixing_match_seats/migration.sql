/*
  Warnings:

  - Added the required column `vacantSeats` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `match` ADD COLUMN `vacantSeats` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `seatId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `seats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seatNo` INTEGER NOT NULL,
    `matchId` INTEGER NOT NULL,
    `ticketId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `seats` ADD CONSTRAINT `seats_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_id_fkey` FOREIGN KEY (`id`) REFERENCES `seats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
