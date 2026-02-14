import express from "express";
import { verifyFirebaseToken as verifyAuth } from "../../middleware/auth.js";
import {
  competitionController,
  categoryController,
} from "./competition.controller.js";
import { registrationController } from "./registration.controller.js";

const router = express.Router();

// Competition Routes
router.post("/competitions", verifyAuth, competitionController.create);
router.get("/competitions", competitionController.getAll);
// Discovery Routes
router.get("/competitions/trending", competitionController.getTrending);
router.get("/competitions/popular", competitionController.getPopular);
router.get("/competitions/new", competitionController.getNew);
router.get("/competitions/upcoming", competitionController.getUpcoming);

router.get("/competitions/:id", competitionController.getById);
router.patch("/competitions/:id", verifyAuth, competitionController.update);
router.delete("/competitions/:id", verifyAuth, competitionController.delete);
router.get(
  "/competitions/organizer/my-competitions",
  verifyAuth,
  competitionController.getByOrganizer,
);
router.patch(
  "/competitions/:id/status",
  verifyAuth,
  competitionController.updateStatus,
);

// Registration Routes
router.post(
  "/competitions/:id/register",
  verifyAuth,
  registrationController.register,
);
router.get(
  "/registrations/my",
  verifyAuth,
  registrationController.getMyRegistrations,
);
router.get(
  "/competitions/:id/registrations",
  verifyAuth,
  registrationController.getCompetitionRegistrations,
);
router.patch(
  "/registrations/:id/status",
  verifyAuth,
  registrationController.updateStatus,
);
router.post(
  "/registrations/:id/withdraw",
  verifyAuth,
  registrationController.withdraw,
);

// Category Routes
router.post("/categories", verifyAuth, categoryController.create); // Admin only
router.get("/categories", categoryController.getAll);
router.get("/categories/:id", categoryController.getById);
router.patch("/categories/:id", verifyAuth, categoryController.update); // Admin only
router.delete("/categories/:id", verifyAuth, categoryController.delete); // Admin only

export default router;
