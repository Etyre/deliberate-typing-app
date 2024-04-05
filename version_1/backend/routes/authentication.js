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

router.post("/api/signup", async (req, res) => {});

router.post("/api/login", async (req, res) => {});

export default router;
