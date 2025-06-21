import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginApi, phoneLoginApi, startAutoTokenRefresh } from "../../utils/api";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import { initializeNotifications } from "../../utils/firebaseMessaging";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../utils/firebase";
import PhoneInput from "../../components/PhoneInput";

type LoginInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type PhoneFormInputs = {
  otp: string;
};

import type { UserCredential } from "firebase/auth";
// Define ConfirmationResult interface manually since it's not exported properly
interface ConfirmationResult {
  confirm: (verificationCode: string) => Promise<UserCredential>;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, ] = useState<'email' | 'phone'>('email');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
    setValue: setPhoneValue,
  } = useForm<PhoneFormInputs>({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginApi({
        email: data.email,
        password: data.password,
        client: "web"
      });

      toast.success("Login successful!");
      if (data.rememberMe) {
        localStorage.setItem("token", res.data.accessToken);
      } else {
        sessionStorage.setItem("token", res.data.accessToken);
      }

      // Start automatic token refresh
      startAutoTokenRefresh();

      // Initialize notifications after successful login
      try {
        // Initialize notifications after login (non-blocking)
        setTimeout(() => {
          initializeNotifications();
        }, 1000);
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }

      window.location.href = "/dashboard";
    } catch (err) {
      handleApiError(err, "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log("reCAPTCHA solved successfully");
          },
          'expired-callback': () => {
            console.log("reCAPTCHA expired, please try again");
          },
          'error-callback': (error: unknown) => {
            console.error("reCAPTCHA error:", error);
          }
        });
        setRecaptchaVerifier(verifier);
        return verifier;
      } catch (error) {
        console.error("Error setting up reCAPTCHA:", error);
        throw error;
      }
    }
    return recaptchaVerifier;
  };

  const sendOTP = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Setting up reCAPTCHA...");
      const verifier = setupRecaptcha();

      // Ensure phone number has + prefix
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      console.log("Sending OTP to:", formattedPhone);

      const confirmResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmResult);
      setIsOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (err: unknown) {
      console.error("Error sending OTP:", err);

      // Provide more specific error messages
      if (typeof err === "object" && err !== null && "code" in err) {
        const errorWithCode = err as { code?: string; message?: string };
        if (errorWithCode.code === 'auth/invalid-app-credential') {
          toast.error("Firebase configuration error. Please check authorized domains in Firebase Console.");
        } else if (errorWithCode.code === 'auth/too-many-requests') {
          toast.error("Too many requests. Please try again later.");
        } else if (errorWithCode.code === 'auth/invalid-phone-number') {
          toast.error("Invalid phone number format.");
        } else {
          toast.error(errorWithCode.message || "Failed to send OTP");
        }
      } else {
        toast.error("Failed to send OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data: PhoneFormInputs) => {
    if (!confirmationResult) {
      toast.error("Please request OTP first");
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(data.otp);
      const idToken = await result.user.getIdToken();

      const res = await phoneLoginApi({ idToken });

      toast.success("Login successful!");
      localStorage.setItem("token", res.data.accessToken);

      startAutoTokenRefresh();

      try {
        setTimeout(() => {
          initializeNotifications();
        }, 1000);
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }

      window.location.href = "/dashboard";
    } catch (err) {
      handleApiError(err, "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPhoneForm = () => {
    setIsOtpSent(false);
    setConfirmationResult(null);
    setPhoneNumber("");
    setPhoneValue("otp", "");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Propinfinia</h1>
          <h2 className="text-xl text-gray-600">Sign in to your account</h2>
        </div>

        {/* Login Method Toggle */}
        {/* <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('email');
              resetPhoneForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginMethod === 'email'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginMethod === 'phone'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Phone Login
          </button>
        </div> */}

        {loginMethod === 'email' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                disabled={isLoading}
                className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none outline-none text-sm ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none outline-none text-sm ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    }`}
                >
                  <i
                    className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"
                      } text-gray-400`}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                disabled={isLoading}
                className={`h-4 w-4 text-indigo-600 outline-none border-gray-300 rounded ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  }`}
                {...register("rememberMe")}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-gray-500 !rounded-button whitespace-nowrap ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Processing...
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in-alt mr-2"></i> Sign in
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {!isOtpSent ? (
              <div className="space-y-6">
                <PhoneInput
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  placeholder="Enter phone number"
                  disabled={isLoading}
                  label="Phone Number"
                  required
                />

                <button
                  type="button"
                  onClick={sendOTP}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isLoading || !phoneNumber}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-mobile-alt mr-2"></i> Send OTP
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPhone(verifyOTP)} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border ${phoneErrors.otp ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none outline-none text-sm ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    {...registerPhone("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Enter a valid 6-digit OTP",
                      },
                    })}
                  />
                  {phoneErrors.otp && (
                    <p className="mt-1 text-sm text-red-600">
                      {phoneErrors.otp.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i> Verify OTP
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetPhoneForm}
                  className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back to Phone Number
                </button>
              </form>
            )}
          </div>
        )}

        {/* Hidden recaptcha container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
