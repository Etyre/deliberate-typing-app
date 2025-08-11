/*
  Warnings:

  - The values [BOTH_MISSED_AND_ADDED_MANUALLY] on the enum `TrackedTokenSource` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TrackedTokenSource_new" AS ENUM ('MISSED_IN_PRACTICE', 'ADDED_MANUALLY', 'MISSED_AND_THEN_ADDED_MANUALLY');
ALTER TABLE "UserTrackedToken" ALTER COLUMN "tokenSource" DROP DEFAULT;
ALTER TABLE "UserTrackedToken" ALTER COLUMN "tokenSource" TYPE "TrackedTokenSource_new" USING ("tokenSource"::text::"TrackedTokenSource_new");
ALTER TYPE "TrackedTokenSource" RENAME TO "TrackedTokenSource_old";
ALTER TYPE "TrackedTokenSource_new" RENAME TO "TrackedTokenSource";
DROP TYPE "TrackedTokenSource_old";
ALTER TABLE "UserTrackedToken" ALTER COLUMN "tokenSource" SET DEFAULT 'MISSED_IN_PRACTICE';
COMMIT;
