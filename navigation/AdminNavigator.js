import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminNavigation from "../components/AdminNavigation";

const Stack = createNativeStackNavigator();

export default function PublicNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Admin" component={AdminNavigation} />
        </Stack.Navigator>
    );
}
