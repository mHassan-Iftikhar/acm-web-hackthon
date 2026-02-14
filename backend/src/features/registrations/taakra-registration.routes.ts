import { Router } from "express";
import { submitTaakra2026 } from "./taakra-registration.controller.js";

const router = Router();

router.post("/taakra-2026", submitTaakra2026);

export default router;
