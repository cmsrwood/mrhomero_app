import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DefaultNavigation from "../components/DefaultNavigation";

const Stack = createNativeStackNavigator();

export default function PublicNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Default" component={DefaultNavigation} />
        </Stack.Navigator>
    );
}
