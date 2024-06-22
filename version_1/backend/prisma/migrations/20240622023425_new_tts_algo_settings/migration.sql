-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ttsAlgoDeliberatePractice" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ttsAlgoPrioritizeLapsedTokens" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ttsAlgoReviewGraduatedTokens" BOOLEAN NOT NULL DEFAULT true;
