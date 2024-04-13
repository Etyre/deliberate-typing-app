import { Router } from "express";
import { getCurrentUser } from "../utils/authentication-utils.js";
import { PrismaClient } from "@prisma/client";
import UserDto from "../dtos/user-dto.js";

const prisma = new PrismaClient();

const router = Router();

router.get("/api/user", async (req, res) => {
  const rawUser = await getCurrentUser();
  const user = new UserDto(rawUser);
  res.send(user);
});

router.post("/api/signup", async (req, res) => {
  const newUserData = req.body.newUserData;

  let messages = [];
  //   check 1: is the given email already in the database?
  const existingUser = await prisma.user.findFirst({
    where: { emailAddress: newUserData.newUserEmail },
  });

  console.log(newUserData);

  if (existingUser) {
    messages.push("This email address is already registered.");
  } else {
    messages.push("This email address is available!");
  }

  //  Check 2: is this a well formed email address?

  res.send(messages);
});

router.post("/api/login", async (req, res) => {});

export default router;
