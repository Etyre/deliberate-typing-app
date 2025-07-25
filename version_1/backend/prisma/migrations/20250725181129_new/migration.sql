-- CreateEnum
CREATE TYPE "TokenActivationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "UserTrackedToken" ADD COLUMN     "activationStatus" "TokenActivationStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tokenSource" "TrackedTokenSource" NOT NULL DEFAULT 'MISSED_IN_PRACTICE';
