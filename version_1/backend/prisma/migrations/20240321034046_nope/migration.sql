/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `TrackedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TrackedToken_text_key" ON "TrackedToken"("text");
