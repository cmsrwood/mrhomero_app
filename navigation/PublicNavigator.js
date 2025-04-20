import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import IndexDefault from "../screens/default/IndexDefault";
import LoginScreen from "../screens/default/LoginScreen";
import RegistrarScreen from "../screens/default/RegistrarScreen";
import MenuDefaultScreen from '../screens/default/MenuDefaultScreen';
import CategoriaScreen from '../screens/default/CategoriaScreen';
import ProductoScreen from '../screens/default/ProductoScreen';
import RecuperarScreen from '../screens/default/RecuperarScreen';
import RecuperarEmailScreen from '../screens/default/RecuperarEmailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const LoginStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegistrarScreen" component={RegistrarScreen} />
        <Stack.Screen name="RecuperarEmailScreen" component={RecuperarEmailScreen} />
        <Stack.Screen name="RecuperarScreen" component={RecuperarScreen} />
    </Stack.Navigator>
);

const MenuStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MenuScreen" component={MenuDefaultScreen} />
        <Stack.Screen name="CategoriaScreen" component={CategoriaScreen} />
        <Stack.Screen name="ProductoScreen" component={ProductoScreen} />
    </Stack.Navigator>
);

export default function PublicNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#2B3035",
                    height: 60,
                    paddingBottom: 5,
                    borderTopColor: "#444",
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (route.name === "Inicio") {
                        iconName = focused ? "home-sharp" : "home-outline";
                    } else if (route.name === "Menu") {
                        iconName = focused ? "list" : "list-outline";
                    } else if (route.name === "Cuenta") {
                        iconName = focused ? "person-circle" : "person-circle-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#B0B0B0",
            })}
        >
            <Tab.Screen name="Inicio" component={IndexDefault} />
            <Tab.Screen name="Menu" component={MenuStack} />
            <Tab.Screen name="Cuenta" component={LoginStack} />
        </Tab.Navigator>
    );
}
