import api from './api';

export const adminApi = {
  listUsers: async (page = 1, limit = 50) => {
    const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return res.data.data;
  },
  createUser: async (payload: { email: string; password: string; displayName?: string; role?: string }) => {
    const res = await api.post('/admin/users', payload);
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};

export default adminApi;
