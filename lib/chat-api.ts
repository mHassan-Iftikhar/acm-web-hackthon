import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token
apiClient.interceptors.request.use(async (config) => {
  // We can't use useAuth here as it's not a component
  // But we can get the current user from firebase/auth directly if needed
  // or pass the token from the component calling the API
  return config;
});

export const chatApi = {
  getChatHistory: async (userId: string) => {
    const response = await apiClient.get(`/chat/history/${userId}`);
    return response.data.data;
  },

  getAdminChats: async () => {
    const response = await apiClient.get("/chat/admin/conversations");
    return response.data.data;
  },

  markAsRead: async (userId: string) => {
    const response = await apiClient.post(`/chat/read/${userId}`);
    return response.data.data;
  },
};
