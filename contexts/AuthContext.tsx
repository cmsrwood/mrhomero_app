import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import AuthService from "../services/AuthService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const userData = await AuthService.validarToken();
        if (userData) {
          setUser(userData);
        } else {
          await AsyncStorage.removeItem("token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (response?.token) {
        await AsyncStorage.setItem("token", response.token);
        setUser(response);
        showMessage({
          message: "Bienvenido",
          description: "Has iniciado sesión",
          type: "success",
          icon: "success",
          duration: 2000
        })
      }
    } catch (error) {
      console.error("Error en login:", error);
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger",
        icon: "danger",
      })
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("token");
    showMessage({
      message: "Has cerrado sesión",
      type: "danger",
    })
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
