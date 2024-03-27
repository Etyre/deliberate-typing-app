import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.trackedToken.createMany({
  data: [
    { tokenString: "house" },
    { tokenString: "glory" },
    { tokenString: "strong" },
    { tokenString: "plant" },
    { tokenString: "for" },
  ],
});

console.log("We got to the end of seed.js, at least!");
