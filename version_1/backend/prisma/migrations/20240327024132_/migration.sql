/*
  Warnings:

  - You are about to drop the column `text` on the `TrackedToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenString]` on the table `TrackedToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenString` to the `TrackedToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TrackedToken_text_key";

-- AlterTable
ALTER TABLE "TrackedToken" DROP COLUMN "text",
ADD COLUMN     "tokenString" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TrackedToken_tokenString_key" ON "TrackedToken"("tokenString");
