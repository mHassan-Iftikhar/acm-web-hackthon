import { Request, Response } from "express";
import { registrationService } from "./registration.service";
import { competitionService } from "./competition.service";

export const registrationController = {
  // Register for a competition
  async register(req: Request, res: Response) {
    try {
      const { id: competitionId } = req.params;
      const { teamName, memberNames } = req.body;
      const userId = req.user!.id!;

      const registration = await registrationService.register(
        competitionId,
        userId,
        {
          teamName,
          memberNames,
        },
      );

      res.status(201).json({
        status: "success",
        message: "Registration submitted successfully",
        data: registration,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to submit registration",
      });
    }
  },

  // Get current user's registrations
  async getMyRegistrations(req: Request, res: Response) {
    try {
      const userId = req.user!.id!;
      const registrations =
        await registrationService.getUserRegistrations(userId);

      res.status(200).json({
        status: "success",
        data: registrations,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch your registrations",
      });
    }
  },

  // Get registrations for a specific competition (Admin/Organizer only)
  async getCompetitionRegistrations(req: Request, res: Response) {
    try {
      const { id: competitionId } = req.params;

      // 1. Check if competition exists
      const competition =
        await competitionService.getCompetitionById(competitionId);
      if (!competition) {
        return res.status(404).json({
          status: "error",
          message: "Competition not found",
        });
      }

      // 2. Authorization check: Only organizer or admin
      if (
        competition.organizer.toString() !== req.user!.id &&
        req.user!.role !== "admin"
      ) {
        return res.status(403).json({
          status: "error",
          message:
            "You are not authorized to view registrations for this competition",
        });
      }

      const registrations =
        await registrationService.getCompetitionRegistrations(competitionId);

      res.status(200).json({
        status: "success",
        data: registrations,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch registrations",
      });
    }
  },

  // Update registration status (Admin/Organizer only)
  async updateStatus(req: Request, res: Response) {
    try {
      const { id: registrationId } = req.params;
      const { status, rejectionReason } = req.body;
      const adminId = req.user!.id!;

      // Basic validation
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid status. Must be approved or rejected.",
        });
      }

      const registration = await registrationService.updateStatus(
        registrationId,
        status as "approved" | "rejected",
        adminId,
        rejectionReason,
      );

      res.status(200).json({
        status: "success",
        message: `Registration ${status} successfully`,
        data: registration,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to update registration status",
      });
    }
  },

  // Withdraw registration
  async withdraw(req: Request, res: Response) {
    try {
      const { id: registrationId } = req.params;
      const userId = req.user!.id!;

      const registration = await registrationService.withdraw(
        registrationId,
        userId,
      );

      res.status(200).json({
        status: "success",
        message: "Registration withdrawn successfully",
        data: registration,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to withdraw registration",
      });
    }
  },
};
