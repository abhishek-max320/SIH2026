import apiClient from './apiClient';

export const scanService = {
  // Analyze uploaded crop leaf
  analyzeCrop: async (formData) => {
    return await apiClient.post('/scans/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get recent scans
  getRecentScans: async (limit = 10) => {
    return await apiClient.get(`/scans/recent?limit=${limit}`);
  },

  // Get detailed scan report
  getScanById: async (scanId) => {
    return await apiClient.get(`/scans/${scanId}`);
  },
};
