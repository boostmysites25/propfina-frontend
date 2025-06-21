import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  updatePasswordApi,
  addPhoneNumberApi,
  getUserProfileApi,
} from "../../../utils/api";
import { toast } from "react-hot-toast";
import { handleApiError } from "../../../utils/errorHandler";
import PhoneInput from "../../../components/PhoneInput";

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PhoneFormData = {
  phoneNumber: string;
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"password" | "phone">("password");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  // Fetch user profile to get existing phone number
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfileApi().then((res) => res.data),
  });

  // Update phone number when profile loads
  useEffect(() => {
    if (userProfile?.phone) {
      setPhoneNumber(userProfile.phone);
    }
  }, [userProfile]);

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

  const { reset: resetPhone } = useForm<PhoneFormData>({
    defaultValues: {
      phoneNumber: ""
    }
  });

  // Watch the new password for validation
  const newPassword = watch("newPassword");

  // Update password mutation
  const { mutate: updatePassword, isPending: isPasswordLoading } = useMutation({
    mutationFn: updatePasswordApi,
    onSuccess: () => {
      toast.success("Password updated successfully");
      reset();
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  // Add phone number mutation
  const { mutate: addPhone, isPending: isPhoneLoading } = useMutation({
    mutationFn: addPhoneNumberApi,
    onSuccess: (data) => {
      toast.success(data.data.message || "Phone number added successfully");
      // Don't clear the phone number on success, keep it displayed
      resetPhone();
      setIsUpdated(true);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const onSubmitPassword = (data: PasswordFormData) => {
    updatePassword(data);
  };

  const onSubmitPhone = () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    // Ensure phone number has + prefix
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;
    addPhone({ phoneNumber: formattedPhone });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Update your account settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "password"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="fas fa-lock mr-2"></i>
            Password
          </button>
          <button
            onClick={() => setActiveTab("phone")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "phone"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="fas fa-phone mr-2"></i>
            Phone
          </button>
        </div>

        {activeTab === "password" ? (
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
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
                    errors.currentPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-lg outline-none`}
                  placeholder="Enter your current password"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  disabled={isPasswordLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isPasswordLoading}
                >
                  <i
                    className={`fas ${
                      showCurrentPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
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
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                    },
                  })}
                  disabled={isPasswordLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isPasswordLoading}
                >
                  <i
                    className={`fas ${
                      showNewPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
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
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-lg outline-none`}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  disabled={isPasswordLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPasswordLoading}
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
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
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? (
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
        ) : (
          <div className="space-y-6">
            {isProfileLoading ? (
              <div className="flex items-center justify-center py-8">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
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
                <span className="text-gray-500">Loading profile...</span>
              </div>
            ) : (
              <>
                {userProfile?.phone && !isUpdated ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span className="text-green-700 font-medium">
                        Current Phone Number:
                      </span>
                    </div>
                    <p className="text-green-600 mt-1 font-mono">
                      {userProfile.phone}
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      You can update your phone number below.
                    </p>
                  </div>
                ) : (
                  ""
                )}

                <PhoneInput
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  placeholder="Enter phone number"
                  disabled={isPhoneLoading}
                  label={
                    userProfile?.phone
                      ? "Update Phone Number"
                      : "Add Phone Number"
                  }
                  required
                />

                <button
                  type="button"
                  onClick={onSubmitPhone}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap mt-4"
                  disabled={isPhoneLoading || !phoneNumber}
                >
                  {isPhoneLoading ? (
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
                      <span>
                        {userProfile?.phone ? "Updating..." : "Adding..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-phone text-sm"></i>
                      <span>
                        {userProfile?.phone
                          ? "Update Phone Number"
                          : "Add Phone Number"}
                      </span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
