-- AlterTable
ALTER TABLE "Sample" ALTER COLUMN "numberOfTargetWords" DROP NOT NULL,
ALTER COLUMN "numberOfTargetCharacters" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "emailAddress" DROP NOT NULL;
