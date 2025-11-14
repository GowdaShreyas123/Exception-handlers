// src/api/apiClient.ts
import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import Cookies from 'js-cookie';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Make sure this is defined in your .env file
  withCredentials: true, // optional — use if backend sets cookies
});

// ✅ Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get('authToken'); // get token from cookies

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ✅ Response interceptor (no refresh logic yet)
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    // optional: handle common API errors globally
    if (error.response?.status === 401) {
      console.warn('Unauthorized: token may be invalid or expired');
      Cookies.remove('authToken');
      // you could redirect to login here if you want
    }

    return Promise.reject(error);
  }
);

export default apiClient;
