-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_id_fkey`;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_seatId_fkey` FOREIGN KEY (`seatId`) REFERENCES `Seat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
