import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import IndexAdmin from "../screens/admin/IndexAdmin";
import Details from "../screens/admin/Details";

const Tab = createBottomTabNavigator();

export default function AdminNavigation() {
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
                    if (route.name === "IndexAdmin") {
                        iconName = focused ? "home-sharp" : "home-outline";
                    } else if (route.name === "Details") {
                        iconName = "person-add-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#B0B0B0",
            })}
        >
            <Tab.Screen name="IndexAdmin" component={IndexAdmin} options={{ title: "Home" }} />
            <Tab.Screen name="Details" component={Details} options={{ title: "Details" }} />
        </Tab.Navigator>
    );
}
