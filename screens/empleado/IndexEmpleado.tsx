import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import EmpleadoLayout from "../../components/EmpleadoLayout";

export default function IndexEmpleado() {
    return (
        <EmpleadoLayout>
            <View>
                <Text>Index Empleado</Text>

            </View>
        </EmpleadoLayout>
    );
}
