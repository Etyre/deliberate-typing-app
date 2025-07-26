import express from "express";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "../utils/authentication-utils.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/api/tracked-tokens", async (req, res) => {
  const user = await getCurrentUser(req, res);
  if (!user) {
    return res
      .status(401)
      .json({ error: "You need to log in before you can add words!" });
  }
  //   Get the current user, and validate that there is a current user.

  const tokenString = req.body.tokenString;

  if (!tokenString || tokenString.trim() === "") {
    return res.status(400).json({ error: "Token string is required" });
  }
  //   Get the token string from the request body, and validate that it both exists and is non-empty.

  try {
    const addedToken = await prisma.trackedToken.upsert({
      where: { tokenString: tokenString.trim() },
      update: {},
      create: { tokenString: tokenString.trim() },
    });

    //   Upsert the token to the Global Tracked Token table (not the user-specific table).

    const addedUserTrackedToken = await prisma.userTrackedToken.upsert({
      where: {
        userId_trackedTokenId: {
          userId: user.id,
          trackedTokenId: addedToken.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        trackedTokenId: addedToken.id,
        tokenSource: "ADDED_MANUALLY",
        activationStatus: "ACTIVE",
      },
    });
    //   Upsert the token to the user-specific table.
    res.status(200).json({ success: true, token: addedUserTrackedToken });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error upserting token into two tables in the database" });
  }
});
export default router;
