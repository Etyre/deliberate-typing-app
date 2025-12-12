import { describe, it, expect, beforeEach } from "vitest";
import { getNewManuallyAddedTokens } from "../../utils/training-token-selection";
import { PrismaClient } from "@prisma/client";
import seedRandom from "seedrandom";

const prisma = new PrismaClient();

describe("reviewGraduatedTokens", () => {
  beforeEach(async () => {
    // we want to clear and recreate the database to set up the test

    // Clear existing data
    await prisma.sampleTrainingToken.deleteMany();
    await prisma.sampleTrackedToken.deleteMany();
    await prisma.sample.deleteMany();
    await prisma.userTrackedToken.deleteMany();
    await prisma.trackedToken.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    await prisma.user.create({
      data: {
        id: 1,
        username: "test user",
        passwordHash: "test",
        passwordSalt: "test",
        emailAddress: "test@test.com",
        hasPaid: false,
      },
    });

    // Create a tracked token
    await prisma.trackedToken.create({
      data: { id: 1, tokenString: "a" },
    });

    // Create user-tracked token relationship (manually added)
    await prisma.userTrackedToken.create({
      data: {
        userId: 1,
        trackedTokenId: 1,
        tokenSource: "ADDED_MANUALLY",
        status: "PENDING", // or whatever status is appropriate
      },
    });
  });
});
