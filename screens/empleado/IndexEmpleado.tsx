import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import EmpleadoLayout from "../../components/EmpleadoLayout";

export default function IndexEmpleado() {
    const { user, logout } = useContext(AuthContext);

    return (
        <EmpleadoLayout>
            <View>
                <Text>Bienvenido, {user?.nombre}!</Text>
                <TouchableOpacity
                    onPress={() => {
                        console.log("Cerrando sesión...");
                        logout();
                    }}
                    style={{ padding: 10, backgroundColor: "red", marginTop: 20 }}
                >
                    <Text style={{ color: "white", textAlign: "center" }}>Cerrar Sesión</Text>
                </TouchableOpacity>

            </View>
        </EmpleadoLayout>
    );
}
