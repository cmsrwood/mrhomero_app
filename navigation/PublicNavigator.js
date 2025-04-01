import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/default/LoginScreen";
import RegistrarScreen from "../screens/default/RegistrarScreen";

const Stack = createNativeStackNavigator();

export default function PublicNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RegistrarScreen" component={RegistrarScreen} />
        </Stack.Navigator>
    );
}