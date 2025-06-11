import axios from "axios";
import { setToken, getToken } from '@/services/utils/tokenService'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API base URL is not defined. Please set EXPO_PUBLIC_API_BASE_URL in your environment variables.");
}
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
})


axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      setToken(null); // Clear the token from storage
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
