import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import AddTransaction from "../pages/AddTransaction";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Dashboard />} />

        <Route path="/transactions" element={<Transactions />} />

        <Route path="/transactions/add" element={<AddTransaction />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
