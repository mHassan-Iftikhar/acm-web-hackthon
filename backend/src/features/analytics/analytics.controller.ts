import { Request, Response } from "express";
import Competition from "../../models/Competition.js";
import Registration from "../../models/Registration.js";

export async function getOverview(req: Request, res: Response) {
  try {
    const [
      totalCompetitions,
      competitionsByStatus,
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
    ] = await Promise.all([
      Competition.countDocuments(),
      Competition.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Registration.countDocuments(),
      Registration.countDocuments({ status: "pending" }),
      Registration.countDocuments({ status: "approved" }),
    ]);

    const byStatus: Record<string, number> = {};
    competitionsByStatus.forEach((row: { _id: string; count: number }) => {
      byStatus[row._id] = row.count;
    });

    // Registrations in last 7 days for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const registrationsByDay = await Registration.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalCompetitions,
        competitionsByStatus: byStatus,
        totalRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        registrationsByDay: registrationsByDay.map((r: { _id: string; count: number }) => ({
          date: r._id,
          count: r.count,
        })),
      },
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message || "Failed to fetch analytics",
    });
  }
}
