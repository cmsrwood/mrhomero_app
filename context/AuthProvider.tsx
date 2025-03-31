import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from 'axios';
import { View } from "react-native";

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
            const response = await axios.post("http://localhost:4400/api/auth/ingresar", { email, password });

            if (response.data.token) {
                await AsyncStorage.setItem("authToken", response.data.token);
                setToken(response.data.token);
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
            <View style={{ flex: 1, marginTop: Constants.statusBarHeight,  }}>
                {children}
            </View>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
