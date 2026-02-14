import apiClient from "./api";

export interface DiscoveryCompetition {
  _id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  category?: { _id: string; name: string; icon?: string };
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  registeredCount?: number;
  venue: string;
  status: string;
  entryFee?: number;
  createdAt?: string;
}

export const discoveryService = {
  async getTrending(limit = 8): Promise<DiscoveryCompetition[]> {
    const response = await apiClient.get(
      `/competitions/trending?limit=${limit}`,
    );
    return response.data.data ?? [];
  },

  async getPopular(limit = 8): Promise<DiscoveryCompetition[]> {
    const response = await apiClient.get(
      `/competitions/popular?limit=${limit}`,
    );
    return response.data.data ?? [];
  },

  async getNew(limit = 8): Promise<DiscoveryCompetition[]> {
    const response = await apiClient.get(`/competitions/new?limit=${limit}`);
    return response.data.data ?? [];
  },

  async getUpcoming(limit = 20): Promise<DiscoveryCompetition[]> {
    const response = await apiClient.get(
      `/competitions/upcoming?limit=${limit}`,
    );
    return response.data.data ?? [];
  },
};
