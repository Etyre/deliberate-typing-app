import { Router } from "express";
import {
  authenticateUser,
  getCurrentUser,
  hashPassword,
  logOut,
} from "../utils/authentication-utils.js";
import { PrismaClient } from "@prisma/client";
import UserDto from "../dtos/user-dto.js";
import cookieParser from "cookie-parser";

const prisma = new PrismaClient();

const router = Router();

router.get("/api/user", async (req, res) => {
  const rawUser = await getCurrentUser(req);
  const user = new UserDto(rawUser);
  res.send(user);
});

router.post("/api/signup", async (req, res) => {
  const newUserData = req.body.newUserData;

  let errors = [];
  //   check 1: is the given email already in the database?
  const existingUser = await prisma.user.findFirst({
    where: { emailAddress: newUserData.email },
  });

  console.log(newUserData);

  let dataObjectToReturn = {};

  if (existingUser) {
    errors.push({
      errorMessage: "This email address is already registered",
      associatedInputField: "emailAddress",
    });
  }
  //  Check 2: is this a well formed email address?

  if (
    !newUserData.email.match(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    )
  ) {
    errors.push({
      errorMessage: "This is not a well-formed email address.",
      associatedInputField: "emailAddress",
    });
  }

  //  Check 3: Do these passwords match?

  if (newUserData.password != newUserData.confirmPassword) {
    errors.push({
      errorMessage: "Passwords do not match",
      associatedInputField: "confirmPassword",
    });
  }

  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  const { hash, salt } = hashPassword(newUserData.password);

  const newUser = await prisma.user.create({
    data: {
      emailAddress: newUserData.email,
      username: newUserData.email,
      hasPaid: false,
      passwordHash: hash,
      passwordSalt: salt,
    },
  });

  // This has a side effect of setting a cookie on the client side.
  await authenticateUser(newUserData.email, newUserData.password, res);

  res.status(200).send({
    username: newUser.username,
    email: newUser.emailAddress,
    id: newUser.id,
  });
});

router.post("/api/login", async (req, res) => {
  const loginData = req.body.loginData;

  let errors = [];
  //   check 1: is the given email already in the database?
  const existingUser = await prisma.user.findFirst({
    where: { emailAddress: loginData.email },
  });

  if (!existingUser) {
    errors.push({
      errorMessage: "This email is not registered",
      associatedInputField: "emailAddress",
    });
  }
  //  Check 2: is this a well formed email address?

  if (
    !loginData.email.match(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    )
  ) {
    errors.push({
      errorMessage: "This is not a well-formed email address.",
      associatedInputField: "emailAddress",
    });
  }

  try {
    // This has a side effect of setting a cookie on the client side.
    await authenticateUser(loginData.email, loginData.password, res);
  } catch (error) {
    errors.push({
      errorMessage: error.message,
      associatedInputField: error.inputField,
    });
  }

  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  res.status(200).send({
    username: existingUser.username,
    email: existingUser.emailAddress,
    id: existingUser.id,
  });
});

router.post("/api/logout", async (req, res) => {
  logOut(res);
  res.send({ message: "You have been logged out." });
});

export default router;
