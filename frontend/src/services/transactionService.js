import api from "./api";

export const getTransactions = async ({
  page = 0,
  size = 5,
  sortBy = "date",
  direction = "desc",
  type,
  category,
  startDate,
  endDate,
} = {}) => {
  const params = {
    page,
    size,
    sortBy,
    direction,
  };

  if (type) params.type = type;
  if (category) params.category = category;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get("/transactions", {
    params,
  });

  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await api.post("/transactions", transaction);
  return response.data;
};

export const updateTransaction = async (id, transaction) => {
  const response = await api.put(`/transactions/${id}`, transaction);
  F;
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};
