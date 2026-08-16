import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [type, setType] = useState("");

  const [size] = useState(5);

  const [sortBy, setSortBy] = useState("date");

  const [sortDirection, setSortDirection] = useState("desc");

  // =========================================================
  // FETCH TRANSACTIONS
  // =========================================================

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      let url =
        `/transactions?page=${page}` +
        `&size=${size}` +
        `&sort=${sortBy},${sortDirection}`;

      if (type) {
        url += `&type=${type}`;
      }

      const response = await api.get(url);

      setTransactions(response.data.content);

      setTotalPages(response.data.totalPages);

      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, type, sortBy, sortDirection]);

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);

      fetchTransactions();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to delete transaction.");
    }
  };

  // =========================================================
  // FORMAT MONEY
  // =========================================================

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // =========================================================
  // CHANGE PAGE
  // =========================================================

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>

            <p className="mt-2 text-slate-400">
              Manage all your income and expenses.
            </p>
          </div>

          <Link
            to="/transactions/add"
            className="flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus size={18} />
            Add Transaction
          </Link>
        </div>

        {/* Filters */}

        <div className="mb-6 flex flex-wrap gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          {/* Type */}

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
          >
            <option value="">All Transactions</option>

            <option value="INCOME">Income</option>

            <option value="EXPENSE">Expense</option>
          </select>

          {/* Sort */}

          <select
            value={`${sortBy},${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split(",");

              setSortBy(field);
              setSortDirection(direction);

              setPage(0);
            }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
          >
            <option value="date,desc">Newest First</option>

            <option value="date,asc">Oldest First</option>

            <option value="amount,desc">Highest Amount</option>

            <option value="amount,asc">Lowest Amount</option>

            <option value="title,asc">Title A-Z</option>

            <option value="title,desc">Title Z-A</option>
          </select>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center text-slate-400">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          /* Empty */

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <h2 className="text-xl font-semibold">No transactions found</h2>

            <p className="mt-2 text-slate-400">
              Start tracking your money by adding your first transaction.
            </p>

            <Link
              to="/transactions/add"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium hover:bg-indigo-500"
            >
              <Plus size={18} />
              Add Transaction
            </Link>
          </div>
        ) : (
          <>
            {/* Transaction Table */}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-800 bg-slate-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                        Transaction
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((transaction) => {
                      const isIncome = transaction.type === "INCOME";

                      return (
                        <tr
                          key={transaction.id}
                          className="border-b border-slate-800 transition hover:bg-slate-800/50"
                        >
                          {/* Title */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              {isIncome ? (
                                <ArrowUpCircle
                                  size={22}
                                  className="text-emerald-400"
                                />
                              ) : (
                                <ArrowDownCircle
                                  size={22}
                                  className="text-red-400"
                                />
                              )}

                              <div>
                                <p className="font-medium">
                                  {transaction.title}
                                </p>

                                {transaction.description && (
                                  <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                                    {transaction.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}

                          <td className="px-6 py-5">
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                              {transaction.category}
                            </span>
                          </td>

                          {/* Date */}

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {transaction.date}
                          </td>

                          {/* Amount */}

                          <td
                            className={`px-6 py-5 text-right font-semibold ${
                              isIncome ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {isIncome ? "+" : "-"}

                            {formatAmount(transaction.amount)}
                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/transactions/edit/${transaction.id}`}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-500/10 hover:text-indigo-400"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </Link>

                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}

              <div className="flex flex-col justify-between gap-4 border-t border-slate-800 px-6 py-4 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-400">
                  Showing{" "}
                  <span className="font-medium text-white">
                    {transactions.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-white">
                    {totalElements}
                  </span>{" "}
                  transactions
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={previousPage}
                    disabled={page === 0}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  <span className="text-sm text-slate-400">
                    Page{" "}
                    <span className="font-medium text-white">{page + 1}</span>{" "}
                    of{" "}
                    <span className="font-medium text-white">{totalPages}</span>
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={page >= totalPages - 1}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Transactions;
