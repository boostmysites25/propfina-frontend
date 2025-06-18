import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

/**
 * Handles API errors and displays appropriate toast messages
 * @param error - The error caught in the catch block
 * @param defaultMessage - Optional custom default message to show if no specific error message is available
 */
export const handleApiError = (
  error: unknown,
  defaultMessage = "An unexpected error occurred. Please try again."
): void => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // Server responded with an error status code
      const errorData = axiosError.response.data as { message?: string };
      toast.error(
        errorData.message || 
        "Request failed. Please check your input and try again."
      );
      console.error("API Error Response:", axiosError.response.data);
    } else if (axiosError.request) {
      // Request was made but no response received
      toast.error("No response from server. Please check your connection and try again.");
      console.error("No response received:", axiosError.request);
    } else {
      // Error in setting up the request
      toast.error("Failed to send request. Please try again later.");
      console.error("Request setup error:", axiosError.message);
    }
  } else {
    // Non-Axios error
    console.error("Unexpected error:", error);
    toast.error(defaultMessage);
  }
};