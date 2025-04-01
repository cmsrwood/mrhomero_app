import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from 'axios';
import { View, Alert } from "react-native";

const API_URL = "http://localhost:4400/api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    const response = await axios.get(`${API_URL}/validarToken`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    if (response.status === 200) {
                        setToken(token);
                    }
                    else {
                        await AsyncStorage.removeItem("authToken");
                        setToken(null);
                    }
                }
                else {
                    setToken(null);
                    Alert.alert("Error", "No se pudo obtener el token");
                    await AsyncStorage.removeItem("authToken");
                }
            } catch (error) {
                console.error("Error al obtener el token:", error);
                await AsyncStorage.removeItem("authToken");
                Alert.alert("Error", "El token es invalido");
                setToken(null);
            }
        }
        setLoading(false);
        loadToken();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/ingresar`, { email, password });

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
            <View style={{ flex: 1, marginTop: Constants.statusBarHeight, }}>
                {children}
            </View>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);