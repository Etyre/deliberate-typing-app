import { Router } from "express";
import { getCurrentUser } from "../utils/authentication-utils.js";
import { PrismaClient } from "@prisma/client";
import UserSettingsDto from "../dtos/user-settings-dto.js";

const prisma = new PrismaClient();

const router = Router();

router.put("/api/settings", async (req, res) => {
  const rawUser = await getCurrentUser(req, res);

  const hasPaid = req.body.hasPaid;
  const trialDisplayMode = req.body.trialDisplayMode;
  const trainingTokenSourcing = req.body.trainingTokenSourcing;
  const batchSize = req.body.batchSize;
  const trainingAlgorithm = req.body.trainingAlgorithm;
  const ttsAlgoDeliberatePractice = req.body.ttsAlgoDeliberatePractice;
  const ttsAlgoPrioritizeLapsedTokens = req.body.ttsAlgoPrioritizeLapsedTokens;
  const ttsAlgoReviewGraduatedTokens = req.body.ttsAlgoReviewGraduatedTokens;
  const tokenHighlighting = req.body.tokenHighlighting;
  const tokenHighlightingThreshold = req.body.tokenHighlightingThreshold;
  const trainingThreshold = req.body.trainingThreshold;

  const updatedUserData = await prisma.user.update({
    where: { id: rawUser.id },
    data: {
      trialDisplayMode: trialDisplayMode,
      trainingTokenSourcing: trainingTokenSourcing,
      batchSize: batchSize,
      trainingAlgorithm: trainingAlgorithm,
      ttsAlgoDeliberatePractice: ttsAlgoDeliberatePractice,
      ttsAlgoPrioritizeLapsedTokens: ttsAlgoPrioritizeLapsedTokens,
      ttsAlgoReviewGraduatedTokens: ttsAlgoReviewGraduatedTokens,
      tokenHighlighting: tokenHighlighting,
      tokenHighlightingThreshold: tokenHighlightingThreshold,
      trainingThreshold: trainingThreshold,
    },
  });

  const updatedUserSettings = new UserSettingsDto(updatedUserData);
  res.send(updatedUserSettings);
});

export default router;
