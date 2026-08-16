import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import Navbar from "./Navbar";
import api from "../services/api";

const TransactionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    type: "EXPENSE",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  // =========================================================
  // FETCH TRANSACTION FOR EDIT
  // =========================================================

  useEffect(() => {
    if (isEditMode) {
      fetchTransaction();
    }
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setFetching(true);

      const response = await api.get(`/transactions/${id}`);

      const transaction = response.data;

      setFormData({
        title: transaction.title || "",
        category: transaction.category || "",
        description: transaction.description || "",
        type: transaction.type || "EXPENSE",
        amount: transaction.amount ?? "",
        date: transaction.date || "",
      });
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to load transaction.");

      navigate("/transactions");
    } finally {
      setFetching(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error when user starts correcting field
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // =========================================================
  // FRONTEND VALIDATION
  // =========================================================

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (formData.title.trim().length > 100) {
      newErrors.title = "Title cannot exceed 100 characters.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (formData.category.trim().length > 50) {
      newErrors.category = "Category cannot exceed 50 characters.";
    }

    if (!formData.type) {
      newErrors.type = "Transaction type is required.";
    }

    if (formData.amount === "" || formData.amount === null) {
      newErrors.amount = "Amount is required.";
    } else if (Number.isNaN(Number(formData.amount))) {
      newErrors.amount = "Amount must be a valid number.";
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(String(formData.amount))) {
      newErrors.amount = "Amount can have at most 2 decimal places.";
    }

    if (!formData.date) {
      newErrors.date = "Date is required.";
    } else if (formData.date > new Date().toISOString().split("T")[0]) {
      newErrors.date = "Date cannot be in the future.";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
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

      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        type: formData.type,
        amount: Number(formData.amount),
        date: formData.date,
      };

      if (isEditMode) {
        await api.put(`/transactions/${id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }

      navigate("/transactions");
    } catch (error) {
      console.error(error);

      // Handle Spring validation errors
      if (error.response?.status === 400) {
        const backendErrors = error.response.data;

        if (backendErrors?.errors && typeof backendErrors.errors === "object") {
          setErrors(backendErrors.errors);
        } else {
          setErrors({
            general: backendErrors?.message || "Invalid transaction data.",
          });
        }
      } else {
        setErrors({
          general: error.response?.data?.message || "Something went wrong.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING EDIT PAGE
  // =========================================================

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <div className="flex min-h-[400px] items-center justify-center text-slate-400">
          Loading transaction...
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}

        <div className="mb-8">
          <Link
            to="/transactions"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Transactions
          </Link>

          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
          </h1>

          <p className="mt-2 text-slate-400">
            {isEditMode
              ? "Update your transaction details."
              : "Record your income or expense."}
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8"
        >
          {/* General Error */}

          {errors.general && (
            <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-400">
              {errors.general}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}

            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping"
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.title ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.title && (
                <p className="mt-2 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Category */}

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Food"
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.category ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.category && (
                <p className="mt-2 text-sm text-red-400">{errors.category}</p>
              )}
            </div>

            {/* Type */}

            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 ${
                  errors.type ? "border-red-500" : "border-slate-700"
                }`}
              >
                <option value="EXPENSE">Expense</option>

                <option value="INCOME">Income</option>
              </select>

              {errors.type && (
                <p className="mt-2 text-sm text-red-400">{errors.type}</p>
              )}
            </div>

            {/* Amount */}

            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Amount (₹)
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.amount ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.amount && (
                <p className="mt-2 text-sm text-red-400">{errors.amount}</p>
              )}
            </div>

            {/* Date */}

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 ${
                  errors.date ? "border-red-500" : "border-slate-700"
                }`}
              />

              {errors.date && (
                <p className="mt-2 text-sm text-red-400">{errors.date}</p>
              )}
            </div>

            {/* Description */}

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Description
                <span className="ml-2 text-xs text-slate-500">Optional</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add some details about this transaction..."
                className={`w-full resize-none rounded-lg border bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 ${
                  errors.description ? "border-red-500" : "border-slate-700"
                }`}
              />

              <div className="mt-2 flex justify-between">
                {errors.description ? (
                  <p className="text-sm text-red-400">{errors.description}</p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-slate-500">
                  {formData.description.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/transactions"
              className="rounded-lg border border-slate-700 px-6 py-3 text-center font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Transaction"
                  : "Save Transaction"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default TransactionForm;
