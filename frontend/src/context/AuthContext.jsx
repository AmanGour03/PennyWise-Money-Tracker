import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setIsLoggedIn(true);

    return data;
  };

  const register = async (userData) => {
    return await registerUser(userData);
  };

  const logout = () => {
    logoutUser();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
