import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const token = response.data.token;
  localStorage.setItem("token", token);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};
