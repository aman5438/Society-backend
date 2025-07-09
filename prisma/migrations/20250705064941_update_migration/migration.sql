-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SOCIETY_ADMIN', 'FLAT_OWNER', 'TENANT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "FlatStatus" AS ENUM ('OCCUPIED', 'VACANT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NOCRequestType" AS ENUM ('OWNER_SELLING', 'TENANT_LEAVING');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Society" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "societyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Society_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubSociety" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "societyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubSociety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAssignment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "societyId" INTEGER,
    "subSocietyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flat" (
    "id" SERIAL NOT NULL,
    "flatNumber" TEXT NOT NULL,
    "type" TEXT,
    "societyId" INTEGER NOT NULL,
    "subSocietyId" INTEGER,
    "ownerId" INTEGER,
    "tenantId" INTEGER,
    "status" "FlatStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignupRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "societyId" INTEGER NOT NULL,
    "flatNumber" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "documents" JSONB[],
    "status" "RequestStatus" NOT NULL,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignupRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NOCRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "societyId" INTEGER NOT NULL,
    "flatId" INTEGER NOT NULL,
    "requestType" "NOCRequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NOCRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityId" INTEGER,
    "entityType" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Society_name_key" ON "Society"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Society_societyCode_key" ON "Society"("societyCode");

-- CreateIndex
CREATE INDEX "AdminAssignment_userId_idx" ON "AdminAssignment"("userId");

-- CreateIndex
CREATE INDEX "AdminAssignment_societyId_idx" ON "AdminAssignment"("societyId");

-- CreateIndex
CREATE INDEX "AdminAssignment_subSocietyId_idx" ON "AdminAssignment"("subSocietyId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAssignment_userId_societyId_subSocietyId_key" ON "AdminAssignment"("userId", "societyId", "subSocietyId");

-- CreateIndex
CREATE UNIQUE INDEX "Flat_tenantId_key" ON "Flat"("tenantId");

-- CreateIndex
CREATE INDEX "Flat_ownerId_idx" ON "Flat"("ownerId");

-- CreateIndex
CREATE INDEX "Flat_tenantId_idx" ON "Flat"("tenantId");

-- CreateIndex
CREATE INDEX "Flat_societyId_idx" ON "Flat"("societyId");

-- CreateIndex
CREATE UNIQUE INDEX "Flat_flatNumber_societyId_subSocietyId_key" ON "Flat"("flatNumber", "societyId", "subSocietyId");

-- CreateIndex
CREATE INDEX "SignupRequest_userId_idx" ON "SignupRequest"("userId");

-- CreateIndex
CREATE INDEX "SignupRequest_societyId_idx" ON "SignupRequest"("societyId");

-- CreateIndex
CREATE INDEX "NOCRequest_userId_idx" ON "NOCRequest"("userId");

-- CreateIndex
CREATE INDEX "NOCRequest_societyId_idx" ON "NOCRequest"("societyId");

-- CreateIndex
CREATE INDEX "NOCRequest_flatId_idx" ON "NOCRequest"("flatId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- AddForeignKey
ALTER TABLE "SubSociety" ADD CONSTRAINT "SubSociety_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAssignment" ADD CONSTRAINT "AdminAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAssignment" ADD CONSTRAINT "AdminAssignment_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAssignment" ADD CONSTRAINT "AdminAssignment_subSocietyId_fkey" FOREIGN KEY ("subSocietyId") REFERENCES "SubSociety"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flat" ADD CONSTRAINT "Flat_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flat" ADD CONSTRAINT "Flat_subSocietyId_fkey" FOREIGN KEY ("subSocietyId") REFERENCES "SubSociety"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flat" ADD CONSTRAINT "Flat_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flat" ADD CONSTRAINT "Flat_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignupRequest" ADD CONSTRAINT "SignupRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignupRequest" ADD CONSTRAINT "SignupRequest_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NOCRequest" ADD CONSTRAINT "NOCRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NOCRequest" ADD CONSTRAINT "NOCRequest_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NOCRequest" ADD CONSTRAINT "NOCRequest_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "Flat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
