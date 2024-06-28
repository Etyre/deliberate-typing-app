-- CreateTable
CREATE TABLE "UserTrackedToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackedTokenId" INTEGER NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'PENDING',
    "inPersonalizedCorpus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserTrackedToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTrackedToken" ADD CONSTRAINT "UserTrackedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrackedToken" ADD CONSTRAINT "UserTrackedToken_trackedTokenId_fkey" FOREIGN KEY ("trackedTokenId") REFERENCES "TrackedToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
