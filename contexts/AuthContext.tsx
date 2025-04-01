import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

export const Context = createContext(null);

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = await AuthService.validarToken();
      if (userData) setUser(userData);
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await AuthService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <Context.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </Context.Provider>
  );
};
