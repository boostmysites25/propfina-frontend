import axios from "axios";
import type { login, PropertyFormData, PropertyFilters, UserFilters } from "./types";

export const baseUrl = "http://localhost:3000";

const api = axios.create({
  baseURL: baseUrl,
});

// Create a function to get the latest token
const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

// Function to decode JWT token and get uid
const getUidFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.uid || null;
  } catch {
    return null;
  }
};

// Simplified token refresh - just get a new access token
export const refreshAccessToken = async (): Promise<string | null> => {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing) {
    return null;
  }

  try {
    isRefreshing = true;
    const currentToken = getToken();

    if (!currentToken) {
      throw new Error('No access token available');
    }

    // Use direct axios call to avoid interceptor loops
    const response = await axios.post(`${baseUrl}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${currentToken}`
      }
    });

    if (response.data && response.data.accessToken) {
      const { accessToken } = response.data;

      // Update stored token in same storage location
      if (localStorage.getItem("token")) {
        localStorage.setItem("token", accessToken);
      } else {
        sessionStorage.setItem("token", accessToken);
      }

      return accessToken;
    } else {
      throw new Error('Invalid refresh response');
    }
  } catch (error: any) {
    console.log('Token refresh failed:', error.response?.status);

    // If refresh fails, user needs to login again
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Only redirect if we're not already on login page
    if (window.location.pathname !== '/login') {
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }

    return null;
  } finally {
    isRefreshing = false;
  }
};

// Automatic token refresh timer
let refreshTimer: NodeJS.Timeout | null = null;
let isRefreshing = false;

// Start automatic token refresh (every 14 minutes) - DISABLED for now
export const startAutoTokenRefresh = () => {
  // Clear any existing timer
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  // Refresh every 23 hours (before 24 hour expiry)
  refreshTimer = setInterval(async () => {
    const token = getToken();
    if (token && window.location.pathname !== '/login') {
      await refreshAccessToken();
    }
  }, 23 * 60 * 60 * 1000); // 23 hours
};

// Stop automatic token refresh
export const stopAutoTokenRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

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

// Add response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh endpoint to prevent infinite loops
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Handle 401 errors and attempt token refresh (only once)
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authApi(originalRequest);
      } else {
        // If refresh failed, redirect to login immediately
        if (window.location.pathname !== '/login') {
          console.log('Token refresh failed, redirecting to login');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    // Handle 401 errors that have already been retried - redirect to login
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        console.log('Authentication failed, redirecting to login');
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      }
    }

    return Promise.reject(error);
  }
);

// Simplified login - no cookies needed
export const loginApi = (data: login) => {
  return api.post("/auth/admin-login", data);
};

// Phone login with Firebase ID token
export const phoneLoginApi = (data: { idToken: string }) => {
  return api.post("/auth/phone-login", data);
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

// Get all available cities
export const getAllCitiesApi = () => {
  return authApi.get("/customize/cities");
};

// Get all users with optional loginType filter
export const getUsersApi = (filters?: UserFilters) => {
  return authApi.get("/users", { params: filters });
};

// Get user properties (through visits)
export const getUserPropertiesApi = (username: string) => {
  return authApi.get(`/users/${encodeURIComponent(username)}/properties`);
};

// Get user recent activity
export const getUserRecentActivityApi = (username: string) => {
  return authApi.get(`/users/${encodeURIComponent(username)}/activity`);
};

// Delete a user by ID
export const deleteUserApi = (userId: string) => {
  return authApi.delete(`/users/${userId}`);
};

// Delete a property by ID
export const deletePropertyApi = (propertyId: string) => {
  return authApi.delete(`/properties/${propertyId}`);
};

// Update a property by ID
export const updatePropertyApi = (propertyId: string, data: PropertyFormData) => {
  return authApi.patch(`/properties/${propertyId}`, data);
};

// Update user password
export const updatePasswordApi = (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
  return authApi.patch('/auth/update-password', data);
};

// Add phone number to admin account
export const addPhoneNumberApi = (data: { phoneNumber: string }) => {
  return authApi.post('/auth/register-phone', { phone: data.phoneNumber });
};

// Get current user profile
export const getUserProfileApi = () => {
  return authApi.get('/auth/me');
};

// Notification APIs
// Send push notification to all users
export const sendNotificationApi = (data: { heading: string; message: string }) => {
  return authApi.post('/notifications/queue', data);
};

// Send email notification to all users
export const sendEmailNotificationApi = (data: {
  subject: string;
  message: string;
  recipients?: string[];  // Optional: specific users, otherwise all users
}) => {
  return authApi.post('/notifications/send-email-to-users', data);
};

// Test email functionality
export const testEmailApi = (data: { email: string }) => {
  return authApi.post('/notifications/simple-test', data);
};

export const getAllNotificationsApi = () => {
  return authApi.get('/notifications');
};

export const deleteNotificationApi = (id: string) => {
  return authApi.delete(`/notifications/${id}`);
};

// Store device token for FCM
export const storeDeviceTokenApi = (data: { device_token: string }) => {
  return authApi.post('/device-tokens', data);
};

// Banner Customization APIs
export const saveBannerCustomizationApi = (data: {
  city: string;
  featuredProperties: string[];
  recommendedProperties: string[];
  recentProperties: string[];
}) => {
  return authApi.post(`/customize/banner`, data);
};

export const getBannerCustomizationApi = (city: string) => {
  return authApi.get(`/customize/banner/${city}`);
};

export const deleteBannerCustomizationApi = (city: string) => {
  return authApi.delete(`/customize/banner/${city}`);
};

// Hero Banner Management APIs
export const uploadHeroBannerApi = (city: string, data: { image: string; title: string }) => {
  return authApi.post(`/customize/banner/${city}`, data);
};

export const getHeroBannerApi = (city: string) => {
  return api.get(`/customize/banner?city=${city}`);
};

export const deleteHeroBannerApi = (city: string) => {
  return authApi.delete(`/customize/hero-banner/${city}`);
};

// Initialize Firebase collections
export const initializeCollectionsApi = () => {
  return authApi.post('/customize/initialize-collections');
};

// Visit APIs
export const getVisitsApi = (filters?: { search?: string; startDate?: string; endDate?: string }) => {
  return authApi.get("/visits", { params: filters });
};

export const deleteVisitApi = (visitId: string) => {
  return authApi.delete(`/visits/${visitId}`);
};

export const sendVisitConfirmationApi = (visitId: string) => {
  return authApi.post(`/visits/${visitId}/send-confirmation`);
};
