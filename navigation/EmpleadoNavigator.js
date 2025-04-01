import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndexEmpleado from "../screens/empleado/IndexEmpleado";

const Stack = createNativeStackNavigator();

export default function EmpleadoNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="IndexEmpleado" component={IndexEmpleado} />
        </Stack.Navigator>
    );
}
