import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/transactions?page=0&size=100&sortBy=date",
      );

      const transactionData = response.data.content || [];

      setTransactions(transactionData);

      calculateSummary(transactionData);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setError("Please login again.");
      } else if (error.response?.status === 403) {
        setError("You are not authorized.");
      } else {
        setError("Unable to load transactions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    let income = 0;
    let expense = 0;

    data.forEach((transaction) => {
      if (transaction.type === "INCOME") {
        income += Number(transaction.amount);
      }

      if (transaction.type === "EXPENSE") {
        expense += Number(transaction.amount);
      }
    });

    setSummary({
      income,
      expense,
      balance: income - expense,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}

      <Navbar/>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>

          <p className="mt-2 text-slate-400">
            Here's an overview of your finances.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Summary Cards */}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Balance */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-400">Balance</p>

              <Wallet className="text-indigo-400" size={24} />
            </div>

            <p className="text-3xl font-bold">
              ₹{summary.balance.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Income */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-400">Total Income</p>

              <ArrowUpCircle className="text-emerald-400" size={24} />
            </div>

            <p className="text-3xl font-bold text-emerald-400">
              ₹{summary.income.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Expense */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-400">Total Expense</p>

              <ArrowDownCircle className="text-red-400" size={24} />
            </div>

            <p className="text-3xl font-bold text-red-400">
              ₹{summary.expense.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <div>
              <h3 className="text-xl font-semibold">Recent Transactions</h3>

              <p className="mt-1 text-sm text-slate-400">
                Your latest financial activity
              </p>
            </div>

            <Link
              to="/transactions"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <p className="font-medium">{transaction.title}</p>

                  <p className="mt-1 text-sm text-slate-400">
                    {transaction.category}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={
                      transaction.type === "INCOME"
                        ? "font-semibold text-emerald-400"
                        : "font-semibold text-red-400"
                    }
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}₹
                    {Number(transaction.amount).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {transaction.date}
                  </p>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                No transactions yet.
                <div className="mt-4">
                  <Link
                    to="/transactions/add"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Add your first transaction
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
