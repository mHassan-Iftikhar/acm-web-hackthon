import { Router } from "express";
import { postChat, getStatus } from "./ai.controller.js";

const router = Router();

router.get("/status", getStatus);
// Allow unauthenticated users to use the AI assistant (guest chat)
router.post("/chat", postChat);

export default router;
