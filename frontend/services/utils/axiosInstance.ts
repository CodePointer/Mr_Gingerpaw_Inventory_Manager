import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { setToken, getToken } from '@/services/utils/tokenService'


const axiosInstance = axios.create({
  baseURL: "http://192.168.1.112:8000",
  // baseURL: "https://923a-45-249-116-232.ngrok-free.app:8000",
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
