import { Router } from "express";
import { getCurrentUser } from "../utils/authentication-utils.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

router.post("/api/signup", async (req, res) => {});

router.post("/api/login", async (req, res) => {});

export default router;
