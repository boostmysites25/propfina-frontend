import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordApi } from "../../../utils/api";
import { toast } from "react-hot-toast";
import { handleApiError } from "../../../utils/errorHandler";

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Settings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch the new password for validation
  const newPassword = watch("newPassword");

  // Update password mutation
  const { mutate, isLoading } = useMutation({
    mutationFn: updatePasswordApi,
    onSuccess: () => {
      toast.success("Password updated successfully");
      reset();
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    mutate(data);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Update your account settings and password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                className={`w-full px-4 py-3 border ${
                  errors.currentPassword ? "border-red-300" : "border-gray-300"
                } rounded-lg outline-none`}
                placeholder="Enter your current password"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isLoading}
              >
                <i
                  className={`fas ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                className={`w-full px-4 py-3 border ${
                  errors.newPassword ? "border-red-300" : "border-gray-300"
                } rounded-lg outline-none`}
                placeholder="Enter your new password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                <i
                  className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-lg outline-none`}
                placeholder="Confirm your new password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => 
                    value === newPassword || "Passwords do not match",
                })}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <i
                  className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <i className="fas fa-lock text-sm"></i>
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
