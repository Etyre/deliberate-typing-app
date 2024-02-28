-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "hasPaid" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dateTimeStart" TIMESTAMP(3) NOT NULL,
    "dateTimeEnd" TIMESTAMP(3) NOT NULL,
    "targetText" TEXT NOT NULL,
    "numberOfTargetWords" INTEGER NOT NULL,
    "numberOfTargetCharacters" INTEGER NOT NULL,
    "trainingTokens" TEXT[],
    "missedWords" TEXT[],
    "numberOfMissedWords" INTEGER NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedToken" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "TrackedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleTrackedToken" (
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "trackedTokenId" INTEGER NOT NULL,
    "startIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "SampleTrackedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleTrainingToken" (
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "trackedTokenId" INTEGER NOT NULL,

    CONSTRAINT "SampleTrainingToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleTrackedToken" ADD CONSTRAINT "SampleTrackedToken_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleTrackedToken" ADD CONSTRAINT "SampleTrackedToken_trackedTokenId_fkey" FOREIGN KEY ("trackedTokenId") REFERENCES "TrackedToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleTrainingToken" ADD CONSTRAINT "SampleTrainingToken_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleTrainingToken" ADD CONSTRAINT "SampleTrainingToken_trackedTokenId_fkey" FOREIGN KEY ("trackedTokenId") REFERENCES "TrackedToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
