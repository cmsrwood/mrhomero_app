import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import IndexDefault from "../screens/default/IndexDefault";
import RegistrarScreen from "../screens/default/RegistrarScreen";
import LoginScreen from "../screens/default/LoginScreen";

const Tab = createBottomTabNavigator();

export default function DefaultNavigation() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,  // Oculta el header por defecto
                tabBarStyle: {
                    backgroundColor: "#2B3035",
                    height: 60,
                    paddingBottom: 5,
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (route.name === "IndexDefault") {
                        iconName = focused ? "home-sharp" : "home-outline";
                    } else if (route.name === "RegistrarScreen") {
                        iconName = focused ? "person-add" : "person-add-outline";
                    } else if (route.name === "LoginScreen") {
                        iconName = focused ? "person-circle" : "person-circle-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#B0B0B0",
            })}
        >
            <Tab.Screen name="IndexDefault" component={IndexDefault} options={{ title: "Home" }} />
            <Tab.Screen name="RegistrarScreen" component={RegistrarScreen} options={{ title: "Registrar" }} />
            <Tab.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Iniciar Sesión" }} />
        </Tab.Navigator>
    );
}
