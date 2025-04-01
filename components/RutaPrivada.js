import React from "react";
import { ActivityIndicator } from "react-native";
import useAuth from "../hooks/useAuth";
import HomeScreen from "../screens/admin/Details";
import LoginScreen from "../screens/default/LoginScreen";

export default function RutaPrivada() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return user ? <HomeScreen /> : <LoginScreen />;
}
