import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const registerUser = (data: { name: string; email: string; password: string; bio?: string }) => api.post('/users', data);
export const loginUser = (data: { email: string; password: string }) => api.post('/users/login', data);

export const getUser = (id: string) => api.get(`/users/${id}`);
export const updateUser = (id: string, data: { name: string; bio?: string }) => api.put(`/users/${id}`, data);

export const getUserSkills = (id: string) => api.get(`/users/${id}/skills`);
export const addSkill = (userId: string, data: { skillName: string; skillType: 'HAVE' | 'WANT' }) => api.post(`/users/${userId}/skills`, data);
export const deleteSkill = (id: string) => api.delete(`/skills/${id}`);

export const exploreUsers = (params: { search?: string; skillType?: string; userId?: string }) => api.get('/explore', { params });

export const getSwapRequests = (userId: string) => api.get('/swap-requests', { params: { userId } });
export const createSwapRequest = (data: { senderId: string; receiverId: string; message?: string }) => api.post('/swap-requests', data);
export const updateSwapRequest = (id: string, data: { status: string }) => api.put(`/swap-requests/${id}`, data);

export const getMessages = (swapRequestId: string) => api.get(`/swap-requests/${swapRequestId}/messages`);
export const sendMessage = (swapRequestId: string, data: { senderId: string; messageText: string }) => api.post(`/swap-requests/${swapRequestId}/messages`, data);

export const getDashboard = (userId: string) => api.get('/dashboard', { params: { userId } });

// Fitur 8: Notifikasi Real-time
export const getNotifications = (userId: string) => api.get('/notifications', { params: { userId } });
export const getUnreadNotificationCount = (userId: string) => api.get('/notifications/unread-count', { params: { userId } });
export const markNotificationAsRead = (id: string, userId: string) => api.patch(`/notifications/${id}/read`, { userId });
export const markAllNotificationsAsRead = (userId: string) => api.patch('/notifications/read-all', { userId });

// Fitur 10: Sistem Ulasan & Reputasi Partner
export const createReview = (data: { swapRequestId: string; reviewerId: string; rating: number; comment?: string }) => api.post('/reviews', data);
export const getUserReviews = (userId: string) => api.get(`/users/${userId}/reviews`);
export const getUserReputation = (userId: string) => api.get(`/users/${userId}/reputation`);
export const getSwapReviews = (swapRequestId: string) => api.get(`/swap-requests/${swapRequestId}/reviews`);

export default api;
