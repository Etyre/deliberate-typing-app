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
    id: 1,
    username: "test user",
    passwordHash: null,
    emailAddress: "elityre@gmail.com",
    hasPaid: false,
  },
});

console.log("We got to the end of seed.js, at least!");
