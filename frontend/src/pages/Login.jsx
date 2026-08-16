import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
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

    setError("");
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      console.log("Login response:", response.data);

      // Store JWT
      const token = response.data.token;

      if (!token) {
        setError("Token was not received from server.");
        return;
      }

      localStorage.setItem("token", token);

      // Redirect to dashboard
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message || "Invalid username or password.",
      );
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

          <p className="mt-2 text-slate-400">Manage your money smarter.</p>
        </div>

        {/* Login Card */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h2 className="text-2xl font-bold">Welcome Back</h2>

          <p className="mt-2 text-sm text-slate-400">
            Login to your PennyWise account.
          </p>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}

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
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
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
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
