import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem("authToken");
            if (storedToken) setToken(storedToken);
            setLoading(false);
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:4400/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.token) {
                await AsyncStorage.setItem("authToken", data.token);
                setToken(data.token);
            }
        } catch (error) {
            console.error("Error en login", error);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem("authToken");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
