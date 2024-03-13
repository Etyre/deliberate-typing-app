/*
  Warnings:

  - You are about to drop the column `isCorrect` on the `SampleTrackedToken` table. All the data in the column will be lost.
  - Added the required column `wasMissed` to the `SampleTrackedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SampleTrackedToken" DROP COLUMN "isCorrect",
ADD COLUMN     "wasMissed" BOOLEAN NOT NULL;
