-- AlterTable
ALTER TABLE "users" ADD COLUMN "resetCode" TEXT;
ALTER TABLE "users" ADD COLUMN "resetCodeExpiry" DATETIME;
