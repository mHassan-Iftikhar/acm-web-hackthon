import apiClient from "./api";

export interface AnalyticsOverview {
  totalCompetitions: number;
  competitionsByStatus: Record<string, number>;
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  registrationsByDay: { date: string; count: number }[];
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const response = await apiClient.get("/analytics/overview");
  return response.data.data;
}
