/*
  Warnings:

  - The values [DELIBERATE_PRACTICE_PRIORIZING_LAPSED_WORDS] on the enum `TrainingAlgorithm` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TrainingAlgorithm_new" AS ENUM ('DELIBERATE_PRACTICE', 'DELIBERATE_PRACTICE_PRIORITIZING_LAPSED_WORDS', 'STRICT_WORST_SCORING_FIRST');
ALTER TABLE "User" ALTER COLUMN "trainingAlgorithm" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "trainingAlgorithm" TYPE "TrainingAlgorithm_new" USING ("trainingAlgorithm"::text::"TrainingAlgorithm_new");
ALTER TABLE "Sample" ALTER COLUMN "trainingAlgorithm" TYPE "TrainingAlgorithm_new" USING ("trainingAlgorithm"::text::"TrainingAlgorithm_new");
ALTER TYPE "TrainingAlgorithm" RENAME TO "TrainingAlgorithm_old";
ALTER TYPE "TrainingAlgorithm_new" RENAME TO "TrainingAlgorithm";
DROP TYPE "TrainingAlgorithm_old";
ALTER TABLE "User" ALTER COLUMN "trainingAlgorithm" SET DEFAULT 'STRICT_WORST_SCORING_FIRST';
COMMIT;
