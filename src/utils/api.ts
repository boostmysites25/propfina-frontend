import axios from "axios";
import type { login, PropertyFormData, PropertyFilters } from "./types";

export const baseUrl = "http://localhost:3000";

const api = axios.create({
  baseURL: baseUrl,
});

// Create a function to get the latest token
const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

// authenticated api with interceptor to always use the latest token
const authApi = axios.create({
  baseURL: baseUrl,
});

// Add a request interceptor to always use the latest token
authApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// login
export const loginApi = (data: login) => {
  return api.post("/auth/admin-login", data);
};

export const dashboardStatsApi = () => authApi.get("/dashboard");

// Add property
export const addPropertyApi = (data: PropertyFormData) => {
  return authApi.post("/properties", data);
};

// Get all properties with optional filters
export const getAllPropertiesApi = (filters?: PropertyFilters) => {
  return authApi.get("/properties", { params: filters });
};
