/*
  Warnings:

  - Made the column `attachmentUrl` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "attachmentUrl" SET NOT NULL;
