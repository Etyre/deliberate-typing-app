import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isUserLoggedIn() {
  return true;
}

export async function getCurrentUser() {
  if (isUserLoggedIn()) {
    const user = await prisma.user.findFirst();
    // currently, this is just getting the first user in the table. In the future, after we have a way to check which user is logged in, we'll want to get that specific user instead.
    return user;
  } else {
    return await prisma.user.create({
      data: {
        username: null,
        passwordHash: null,
        emailAddress: null,
        hasPaid: false,
      },
    });
  }
}
