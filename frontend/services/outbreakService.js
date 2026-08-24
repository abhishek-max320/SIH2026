import apiClient from './apiClient';

export const weatherService = {
  getCurrentWeather: async (lat = 30.9010, lon = 75.8573) => {
    return await apiClient.get(`/weather/current?latitude=${lat}&longitude=${lon}`);
  },
};

export const outbreakService = {
  getHeatmapData: async () => {
    return await apiClient.get('/admin/heatmap');
  },

  getAnalytics: async () => {
    return await apiClient.get('/admin/analytics');
  },

  getFarmRisk: async (farmId = 1) => {
    return await apiClient.get(`/risk/farm/${farmId}`);
  },

  getAlerts: async (userId = 1) => {
    return await apiClient.get(`/alerts/?user_id=${userId}`);
  },

  markAlertRead: async (alertId) => {
    return await apiClient.post(`/alerts/${alertId}/read`);
  },

  getRecommendations: async (crop = '', disease = '') => {
    return await apiClient.get(`/recommendations/?crop=${crop}&disease=${disease}`);
  },

  getPendingReviews: async () => {
    return await apiClient.get('/expert/pending');
  },

  submitExpertReview: async (scanId, data) => {
    return await apiClient.post(`/expert/review/${scanId}`, data);
  },

  getTelemetry: async () => {
    return await apiClient.get('/admin/telemetry');
  },
};
