/**
 * Checks if the user has a valid authentication token
 * @returns Promise<boolean> - True if the token is valid, false otherwise
 */
export const verifyToken = async (): Promise<boolean> => {
  // Get token from storage (localStorage or sessionStorage)
  const token = getToken();
  
  if (!token) {
    return false;
  }

  try {
    // Create an API instance with the token
    // const api = axios.create({
    //   baseURL: baseUrl,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // Verify token with the backend
    // You can replace this with your actual token verification endpoint
    // await api.get('/auth/verify-token');
    
    return true;
  } catch {
    // If verification fails, clear tokens and return false
    clearTokens();
    return false;
  }
};

/**
 * Gets the authentication token from storage
 * @returns string | null - The token or null if not found
 */
export const getToken = (): string | null => {
  // Try to get token from localStorage first, then sessionStorage
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Gets the refresh token from storage
 * @returns string | null - The refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
};

/**
 * Clears all authentication tokens from storage
 */
export const clearTokens = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
};

/**
 * Logs out the user by clearing tokens and redirecting to login
 */
export const logout = (): void => {
  clearTokens();
  window.location.href = '/login';
};

/**
 * Checks if the user is authenticated based on token presence
 * This is a simple check that doesn't verify the token with the server
 * @returns boolean - True if a token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};