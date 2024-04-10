import { Router } from "express";
import { getCurrentUser } from "../utils/authentication-utils.js";
import { PrismaClient } from "@prisma/client";
import UserSettingsDto from "../dtos/user-settings-dto.js";

const prisma = new PrismaClient();

const router = Router();

router.put("/api/settings", async (req, res) => {
  const rawUser = await getCurrentUser();

  const hasPaid = req.body.hasPaid;
  const trialDisplayMode = req.body.trialDisplayMode;
  const trainingTokenSourcing = req.body.trainingTokenSourcing;
  const batchSize = req.body.batchSize;
  const trainingAlgorithm = req.body.trainingAlgorithm;
  const tokenHighlighting = req.body.tokenHighlighting;
  const tokenHighlightingThreshold = req.body.tokenHighlightingThreshold;

  const newUserData = await prisma.user.update({
    where: { id: rawUser.id },
    data: {
      trialDisplayMode: trialDisplayMode,
      trainingTokenSourcing: trainingTokenSourcing,
      batchSize: batchSize,
      trainingAlgorithm: trainingAlgorithm,
      tokenHighlighting: tokenHighlighting,
      tokenHighlightingThreshold: tokenHighlightingThreshold,
    },
  });

  const newUserSettings = new UserSettingsDto(newUserData);
  res.send(newUserSettings);
});

export default router;
