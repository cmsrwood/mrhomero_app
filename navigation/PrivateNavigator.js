import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndexAdmin from "../screens/admin/IndexAdmin";

const Stack = createNativeStackNavigator();

export default function PrivateNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="IndexAdmin" component={IndexAdmin} />
        </Stack.Navigator>
    );
}
