import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const newErrors = {};

    // Username

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    } else if (formData.username.trim().length > 30) {
      newErrors.username = "Username cannot exceed 30 characters.";
    }

    // Email

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    // Password

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    // Confirm password

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      setErrors({});

      const response = await api.post("/auth/register", {
        username: formData.username.trim(),

        email: formData.email.trim().toLowerCase(),

        password: formData.password,
      });

      console.log("Registration successful:", response.data);

      // Registration successful
      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful. Please login.",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      const responseData = error.response?.data;

      // Backend validation errors
      if (responseData?.errors && typeof responseData.errors === "object") {
        setErrors(responseData.errors);
      } else {
        setErrors({
          general:
            responseData?.message || "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-400">PennyWise</h1>

          <p className="mt-2 text-slate-400">
            Start managing your money smarter.
          </p>
        </div>

        {/* Card */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h2 className="text-2xl font-bold">Create Account</h2>

          <p className="mt-2 text-sm text-slate-400">
            Create your PennyWise account.
          </p>

          {/* General Error */}

          {errors.general && (
            <div className="mt-6 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-400">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Username */}

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                autoComplete="username"
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.username ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.username && (
                <p className="mt-2 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.email ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.password ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
