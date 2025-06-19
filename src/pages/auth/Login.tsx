import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginApi } from "../../utils/api";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";

type LoginInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginApi({
        email: data.email,
        password: data.password,
        client:"web"
      });

      toast.success("Login successful!");
      if (data.rememberMe) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      } else {
        sessionStorage.setItem("token", res.data.accessToken);
        sessionStorage.setItem("refreshToken", res.data.refreshToken);
      }
      window.location.href = "/dashboard";
    } catch (err) {
      handleApiError(err, "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Propinfinia</h1>
          <h2 className="text-xl text-gray-600">Sign in to your account</h2>
        </div>

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
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none outline-none text-sm ${
                isLoading ? "bg-gray-100 cursor-not-allowed" : ""
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
                className={`w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none outline-none text-sm ${
                  isLoading ? "bg-gray-100 cursor-not-allowed" : ""
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
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                }`}
              >
                <i
                  className={`fa ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
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
              className={`h-4 w-4 text-indigo-600 outline-none border-gray-300 rounded ${
                isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
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
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-gray-500 !rounded-button whitespace-nowrap ${
              isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
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
      </div>
    </div>
  );
};

export default Login;
