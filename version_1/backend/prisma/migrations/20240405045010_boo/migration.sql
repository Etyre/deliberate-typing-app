/*
  Warnings:

  - Added the required column `batchSize` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenHighlighting` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingAlgorithm` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingTokenSourcing` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trialDisplayMode` to the `Sample` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TrialDisplayMode" AS ENUM ('VISUAL', 'AUDIO');

-- CreateEnum
CREATE TYPE "TrainingTokenSourcing" AS ENUM ('ALL_TRACKED_TOKENS', 'MANUAL_LIST');

-- CreateEnum
CREATE TYPE "TrainingAlgorithm" AS ENUM ('DELIBERATE_PRACTICE', 'STRICT_WORST_SCORING_FIRST');

-- CreateEnum
CREATE TYPE "TokenHighlighting" AS ENUM ('CURRENT_TRAINING_TOKENS', 'ALL_TRACKED_TOKENS', 'TRACKED_TOKENS_ABOVE_THRESHOLD', 'NO_HIGHLIGHTING');

-- CreateEnum
CREATE TYPE "TrackedTokenSource" AS ENUM ('MISSED_IN_PRACTICE', 'ADDED_FROM_PERSONAL_CORPUS');

-- AlterTable
ALTER TABLE "Sample" ADD COLUMN     "batchSize" INTEGER NOT NULL,
ADD COLUMN     "tokenHighlighting" "TokenHighlighting" NOT NULL,
ADD COLUMN     "tokenHighlightingThreshold" INTEGER,
ADD COLUMN     "trainingAlgorithm" "TrainingAlgorithm" NOT NULL,
ADD COLUMN     "trainingTokenSourcing" "TrainingTokenSourcing" NOT NULL,
ADD COLUMN     "trialDisplayMode" "TrialDisplayMode" NOT NULL;

-- AlterTable
ALTER TABLE "TrackedToken" ADD COLUMN     "inPersonalizedCorpus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "batchSize" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "tokenHighlighting" "TokenHighlighting" NOT NULL DEFAULT 'CURRENT_TRAINING_TOKENS',
ADD COLUMN     "tokenHighlightingThreshold" INTEGER,
ADD COLUMN     "trainingAlgorithm" "TrainingAlgorithm" NOT NULL DEFAULT 'STRICT_WORST_SCORING_FIRST',
ADD COLUMN     "trainingTokenSourcing" "TrainingTokenSourcing" NOT NULL DEFAULT 'MANUAL_LIST',
ADD COLUMN     "trialDisplayMode" "TrialDisplayMode" NOT NULL DEFAULT 'VISUAL';
