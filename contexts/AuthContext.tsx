import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../services/AuthService";

export const Context = createContext(null);

export function AuthContext({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const userData = await AuthService.validarToken();
        setUser(userData);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    const response = await AuthService.login(email, password);
    const { token } = response;
    await AsyncStorage.setItem("token", token);
    setUser(response);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("token");
    setUser(null);
    setIsLoading(false);
  };

  return (
    <Context.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </Context.Provider>
  );
}