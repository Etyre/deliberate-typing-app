import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { read, readFileSync } from "fs";
import jsonwebtoken from "jsonwebtoken";
import InputError from "./input-error.js";

const prisma = new PrismaClient();

const cookieName = "authToken";

function isUserAuthenticated(req) {
  if (
    !req.header("authorization") ||
    !req.header("authorization").split("Bearer ")[1]
  ) {
    return false;
  }
  return true;
}

export async function getCurrentUser(req, res) {
  if (isUserAuthenticated(req)) {
    const token = req.header("authorization").split("Bearer ")[1];
    let decoded = null;
    const privateKey = readFileSync("./secrets/jwtRS256.key");
    try {
      decoded = jsonwebtoken.verify(token, privateKey);
    } catch (e) {
      if (e.name == "JsonWebTokenError") {
        logOut(res);
      }
      throw e;
    }

    const user = await prisma.user.findFirst({ where: { id: decoded.id } });
    if (!user) {
      throw new Error("Invalid auth token.");
    }
    return user;
  } else {
    const newUser = await prisma.user.create({
      data: {
        username: null,
        passwordHash: null,
        emailAddress: null,
        passwordSalt: null,
        hasPaid: false,
      },
    });
    const webToken = jsonwebtoken.sign(
      { id: newUser.id },
      readFileSync("./secrets/jwtRS256.key"),
      {
        algorithm: "RS256",
      }
    );

    res.cookie(cookieName, webToken);
    return newUser;
  }
}

export async function authenticateUser(email, givenPassword, res) {
  // Check if that user is in there.
  const user = await prisma.user.findFirst({ where: { emailAddress: email } });
  if (!user) {
    throw new InputError("There's no account with this email.", "emailAddress");
  }

  const salt = user.passwordSalt;

  const newlyGeneratedHash = crypto
    .pbkdf2Sync(givenPassword, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  if (user.passwordHash != newlyGeneratedHash) {
    throw new InputError(
      "This is not the correct password for this account.",
      "password"
    );
  }

  const webToken = jsonwebtoken.sign(
    { id: user.id },
    readFileSync("./secrets/jwtRS256.key"),
    {
      algorithm: "RS256",
    }
  );

  res.cookie(cookieName, webToken);
}

export function hashPassword(unhashedPassword) {
  // Creating a unique salt for a particular user
  const salt = crypto.randomBytes(16).toString("hex");

  // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
  const hash = crypto
    .pbkdf2Sync(unhashedPassword, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  return { salt: salt, hash: hash };
}

export async function logOut(res) {
  res.clearCookie(cookieName);
}
