/*
  Warnings:

  - Added the required column `ttsAlgoDeliberatePractice` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ttsAlgoPrioritizeLapsedTokens` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ttsAlgoReviewGraduatedTokens` to the `Sample` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sample" ADD COLUMN     "ttsAlgoDeliberatePractice" BOOLEAN NOT NULL,
ADD COLUMN     "ttsAlgoPrioritizeLapsedTokens" BOOLEAN NOT NULL,
ADD COLUMN     "ttsAlgoReviewGraduatedTokens" BOOLEAN NOT NULL;
