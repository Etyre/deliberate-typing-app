-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('PENDING', 'TRAINING', 'LAPSED', 'GRADUATED');

-- AlterTable
ALTER TABLE "TrackedToken" ADD COLUMN     "status" "TokenStatus" NOT NULL DEFAULT 'PENDING';
