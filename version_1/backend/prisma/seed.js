import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// await prisma.trackedToken.createMany({
//   data: [
//     { tokenString: "house" },
//     { tokenString: "glory" },
//     { tokenString: "strong" },
//     { tokenString: "plant" },
//     { tokenString: "for" },
//   ],
// });

await prisma.user.create({
  data: {
    username: "test user",
    passwordHash: "test",
    passwordSalt: "test",
    emailAddress: "test@test.com",
    hasPaid: false,
  },
});

console.log("We got to the end of seed.js, at least!");
