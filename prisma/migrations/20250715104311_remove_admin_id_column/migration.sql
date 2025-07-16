/*
  Warnings:

  - You are about to drop the column `adminId` on the `SignupRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SignupRequest" DROP CONSTRAINT "SignupRequest_adminId_fkey";

-- AlterTable
ALTER TABLE "SignupRequest" DROP COLUMN "adminId";
