import express from "express";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "../utils/authentication-utils.js";

const router = express.Router();
const prisma = new PrismaClient();

// Your routes go here

export default router;
