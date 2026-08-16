import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import TransactionForm from "../components/TransactionForm";
import ProtectedRoute from "../components/ProtectedRoute";
import Analytics from "../pages/Analytics";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected routes */}

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/transactions" element={<Transactions />} />

          <Route path="/transactions/add" element={<TransactionForm />} />

          <Route path="/transactions/edit/:id" element={<TransactionForm />} />
          
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
