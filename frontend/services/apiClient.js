import axios from 'axios';

let rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
if (rawBaseUrl && !rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://')) {
  rawBaseUrl = `https://${rawBaseUrl}`;
}
if (rawBaseUrl && !rawBaseUrl.endsWith('/api/v1') && !rawBaseUrl.endsWith('/api/v1/')) {
  rawBaseUrl = `${rawBaseUrl.replace(/\/$/, '')}/api/v1`;
}

const apiClient = axios.create({
  baseURL: rawBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('agrisentinel_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalized Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let formattedError = {
      message: 'Network request failed. Please check your connection.',
      code: 'NETWORK_ERROR',
      status: error?.response?.status || 500,
      details: null,
    };

    if (error.response) {
      const data = error.response.data;
      formattedError.message = data?.detail || data?.message || error.message;
      formattedError.code = data?.code || `HTTP_${error.response.status}`;
      formattedError.details = data;
    } else if (error.request) {
      formattedError.message = 'AgriSentinel AI backend service is currently unreachable.';
      formattedError.code = 'BACKEND_OFFLINE';
    }

    return Promise.reject(formattedError);
  }
);

export default apiClient;
