/*
  Warnings:

  - Added the required column `checkoutDate` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "checkoutDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "isDue" BOOLEAN NOT NULL DEFAULT true;
