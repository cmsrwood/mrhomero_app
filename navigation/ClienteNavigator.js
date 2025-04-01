import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndexCliente from "../screens/cliente/IndexCliente";

const Stack = createNativeStackNavigator();

export default function ClienteNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="IndexCliente" component={IndexCliente} />
        </Stack.Navigator>
    );
}
