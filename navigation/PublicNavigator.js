import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

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

const LoginStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrarScreen" component={RegistrarScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RecuperarEmailScreen" component={RecuperarEmailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RecuperarScreen" component={RecuperarScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const MenuStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MenuDefaultScreen" component={MenuDefaultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CategoriaDefaultScreen" component={CategoriaScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProductoDefaultScreen" component={ProductoScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};
export default function PublicNavigator() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: "#2B3035",
                height: 60,
                paddingBottom: 5,
            },
            tabBarIcon: ({ color, size, focused }) => {
                let iconName;
                if (route.name === "IndexDefault") {
                    iconName = focused ? "home-sharp" : "home-outline";
                } else if (route.name === "Menu") {
                    iconName = focused ? "list" : "list-outline";
                } else if (route.name === "Iniciar Sesion") {
                    iconName = focused ? "person-circle" : "person-circle-outline";
                } 
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "#B0B0B0",
        })}>

            <Tab.Screen name="IndexDefault" component={IndexDefault} />
            <Tab.Screen name="Menu" component={MenuStack} />
            <Tab.Screen name="Iniciar Sesion" component={LoginStack} />
        </Tab.Navigator>
    );
};
