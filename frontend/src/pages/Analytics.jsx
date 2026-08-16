import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Wallet } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

import api from "../services/api";
import Navbar from "../components/Navbar";

const COLORS = [
  "#6366f1", // Indigo
  "#22c55e", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#eab308", // Yellow
];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [summaryResponse, categoryResponse, monthlyResponse] =
        await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/categories"),
          api.get("/analytics/monthly?months=6"),
        ]);

      setSummary(summaryResponse.data);
      setCategories(categoryResponse.data);
      setMonthly(monthlyResponse.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300">
        <Navbar />

        <div className="flex min-h-[400px] items-center justify-center">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-indigo-400" size={32} />

            <h1 className="text-3xl font-bold">Financial Analytics</h1>
          </div>

          <p className="mt-2 text-slate-400">
            Understand where your money is going.
          </p>
        </div>

        {/* Summary */}

        {summary && (
          <div className="grid gap-6 md:grid-cols-4">
            <SummaryCard
              title="Total Income"
              value={formatAmount(summary.totalIncome)}
              icon={<TrendingUp size={22} />}
            />

            <SummaryCard
              title="Total Expense"
              value={formatAmount(summary.totalExpense)}
              icon={<TrendingDown size={22} />}
            />

            <SummaryCard
              title="Balance"
              value={formatAmount(summary.balance)}
              icon={<Wallet size={22} />}
            />

            <SummaryCard
              title="Savings Rate"
              value={`${summary.savingsRate}%`}
              icon={<BarChart3 size={22} />}
            />
          </div>
        )}

        {/* Charts */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* ================================================= */}
          {/* MONTHLY CHART */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">Monthly Overview</h2>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                  <XAxis dataKey="month" stroke="#94a3b8" />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip
                    formatter={(value) => formatAmount(value)}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />

                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#34d399"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#f87171"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ================================================= */}
          {/* EXPENSE CATEGORY PIE CHART */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-1 text-xl font-semibold">Expenses by Category</h2>

            <p className="mb-4 text-sm text-slate-400">
              See where most of your money is being spent.
            </p>

            <div className="h-[350px]">
              {categories.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No expense data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="45%"
                      outerRadius={115}
                      innerRadius={65}
                      paddingAngle={3}
                      labelLine={false}
                      label={({ category, percent }) =>
                        `${category} ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {categories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#0f172a"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>

                    {/* Tooltip */}

                    <Tooltip
                      formatter={(value) => formatAmount(value)}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                      itemStyle={{
                        color: "#ffffff",
                      }}
                    />

                    {/* Legend */}

                    <Legend
                      verticalAlign="bottom"
                      height={45}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>

        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
