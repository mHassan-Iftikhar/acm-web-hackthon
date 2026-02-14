import apiClient from "./api";

export const competitionApi = {
  // Get all competitions
  async getCompetitions(filters?: {
    status?: string;
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.page) params.append("page", String(filters.page));

    const response = await apiClient.get(`/competitions?${params.toString()}`);
    return response.data.data;
  },

  // Get single competition
  async getCompetition(id: string) {
    const response = await apiClient.get(`/competitions/${id}`);
    return response.data.data;
  },

  // Create competition
  async createCompetition(data: {
    title: string;
    description: string;
    shortDescription: string;
    category: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    maxParticipants: number;
    venue: string;
    entryFee?: number;
    rules?: string;
    prizes?: string;
  }) {
    const response = await apiClient.post("/competitions", data);
    return response.data.data;
  },

  // Update competition
  async updateCompetition(id: string, data: any) {
    const response = await apiClient.patch(`/competitions/${id}`, data);
    return response.data.data;
  },

  // Delete competition
  async deleteCompetition(id: string) {
    await apiClient.delete(`/competitions/${id}`);
  },

  // Get my competitions (organizer)
  async getMyCompetitions(limit = 10, page = 1) {
    const response = await apiClient.get(
      `/competitions/organizer/my-competitions?limit=${limit}&page=${page}`,
    );
    return response.data.data;
  },

  // Update competition status
  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch(`/competitions/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  // Registration Methods
  async registerToCompetition(
    competitionId: string,
    data: { teamName?: string; memberNames: string[] },
  ) {
    const response = await apiClient.post(
      `/competitions/${competitionId}/register`,
      data,
    );
    return response.data.data;
  },

  async getMyRegistrations() {
    const response = await apiClient.get("/registrations/my");
    return response.data.data;
  },

  async getCompetitionRegistrations(competitionId: string) {
    const response = await apiClient.get(
      `/competitions/${competitionId}/registrations`,
    );
    return response.data.data;
  },

  async updateRegistrationStatus(
    registrationId: string,
    status: "approved" | "rejected",
    rejectionReason?: string,
  ) {
    const response = await apiClient.patch(
      `/registrations/${registrationId}/status`,
      { status, rejectionReason },
    );
    return response.data.data;
  },

  async withdrawRegistration(registrationId: string) {
    const response = await apiClient.post(
      `/registrations/${registrationId}/withdraw`,
    );
    return response.data.data;
  },
};

export const categoryApi = {
  // Get all categories
  async getCategories() {
    const response = await apiClient.get("/categories");
    return response.data.data;
  },

  // Get single category
  async getCategory(id: string) {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },

  // Create category (admin only)
  async createCategory(data: {
    name: string;
    description: string;
    icon?: string;
    color?: string;
  }) {
    const response = await apiClient.post("/categories", data);
    return response.data.data;
  },

  // Update category (admin only)
  async updateCategory(id: string, data: any) {
    const response = await apiClient.patch(`/categories/${id}`, data);
    return response.data.data;
  },

  // Delete category (admin only)
  async deleteCategory(id: string) {
    await apiClient.delete(`/categories/${id}`);
  },
};
