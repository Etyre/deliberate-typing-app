import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.trackedToken.createMany({
  data: [
    { text: "house" },
    { text: "glory" },
    { text: "strong" },
    { text: "plant" },
    { text: "for" },
  ],
});

console.log("We got to the end of seed.js, at least!");
