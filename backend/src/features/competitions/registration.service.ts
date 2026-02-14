import Registration, { IRegistration } from "../../models/Registration";
import Competition from "../../models/Competition";
import mongoose from "mongoose";

export const registrationService = {
  // Register a user for a competition
  async register(
    competitionId: string,
    userId: string,
    data: { teamName?: string; memberNames: string[] },
  ): Promise<IRegistration> {
    // 1. Check if competition exists
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      throw new Error("Competition not found");
    }

    // 2. Check if registration is open
    if (competition.status !== "registration_open") {
      throw new Error("Registration is not open for this competition");
    }

    // 3. Check if registration deadline has passed
    if (new Date() > new Date(competition.registrationDeadline)) {
      throw new Error("Registration deadline has passed");
    }

    // 4. Check if user is already registered
    const existingRegistration = await Registration.findOne({
      competition: competitionId,
      user: userId,
      status: { $ne: "withdrawn" },
    });
    if (existingRegistration) {
      throw new Error("You are already registered for this competition");
    }

    // 5. Check if competition is full
    if (competition.registeredCount >= competition.maxParticipants) {
      throw new Error("Competition is full");
    }

    // 6. Create registration
    const registration = await Registration.create({
      competition: competitionId,
      user: userId,
      teamName: data.teamName,
      memberNames: data.memberNames,
      status: "pending",
      paymentStatus: competition.entryFee > 0 ? "pending" : "completed",
    });

    return registration;
  },

  // Get registrations for a competition (Admin/Organizer only)
  async getCompetitionRegistrations(competitionId: string) {
    return Registration.find({ competition: competitionId })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });
  },

  // Get user's registrations
  async getUserRegistrations(userId: string) {
    return Registration.find({ user: userId })
      .populate("competition", "title startDate status category")
      .sort({ createdAt: -1 });
  },

  // Update registration status (Approve/Reject)
  async updateStatus(
    registrationId: string,
    status: "approved" | "rejected",
    adminId: string,
    rejectionReason?: string,
  ): Promise<IRegistration | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const registration =
        await Registration.findById(registrationId).session(session);
      if (!registration) {
        throw new Error("Registration not found");
      }

      if (registration.status !== "pending") {
        throw new Error("Registration is already processed");
      }

      registration.status = status;
      registration.approvedBy = new mongoose.Types.ObjectId(adminId);
      registration.approvalDate = new Date();
      if (rejectionReason) {
        registration.rejectionReason = rejectionReason;
      }

      await registration.save({ session });

      // If approved, increment competition registered count
      if (status === "approved") {
        const competition = await Competition.findById(
          registration.competition,
        ).session(session);
        if (competition) {
          competition.registeredCount += 1;
          await competition.save({ session });
        }
      }

      await session.commitTransaction();
      return registration;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  // Withdraw registration
  async withdraw(
    registrationId: string,
    userId: string,
  ): Promise<IRegistration | null> {
    const registration = await Registration.findOne({
      _id: registrationId,
      user: userId,
    });
    if (!registration) {
      throw new Error("Registration not found");
    }

    if (registration.status === "withdrawn") {
      throw new Error("Registration is already withdrawn");
    }

    const oldStatus = registration.status;
    registration.status = "withdrawn";
    await registration.save();

    // If it was already approved, decrement the competition count
    if (oldStatus === "approved") {
      await Competition.findByIdAndUpdate(registration.competition, {
        $inc: { registeredCount: -1 },
      });
    }

    return registration;
  },
};
