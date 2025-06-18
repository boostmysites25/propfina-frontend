import axios from "axios";
import type { login } from "./types";

export const baseUrl = "http://localhost:3000";

const api = axios.create({
  baseURL: baseUrl,
});

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

// authenticated api
const authApi = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// login
export const loginApi = (data: login) => {
  return api.post("/auth/admin-login", data);
};

export const dashboardStatsApi = () => authApi.get("/dashboard");
