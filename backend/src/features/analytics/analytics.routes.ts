import { Router } from "express";
import { verifyAuth, requireRole } from "../../middleware/auth.js";
import { getOverview } from "./analytics.controller.js";

const router = Router();

router.get("/overview", verifyAuth, requireRole(["admin", "organizer"]), getOverview);

export default router;
