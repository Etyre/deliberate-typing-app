/*
  Warnings:

  - You are about to drop the column `inPersonalizedCorpus` on the `TrackedToken` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TrackedToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,trackedTokenId]` on the table `UserTrackedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TrackedToken" DROP COLUMN "inPersonalizedCorpus",
DROP COLUMN "status";

-- CreateIndex
CREATE UNIQUE INDEX "UserTrackedToken_userId_trackedTokenId_key" ON "UserTrackedToken"("userId", "trackedTokenId");
