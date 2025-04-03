import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import IndexAdmin from "../screens/admin/IndexAdmin";
import LoginScreen from "../screens/default/LoginScreen";
import RegistrarScreen from "../screens/default/RegistrarScreen";
import MenuDefault from '../screens/default/MenuDefaultScreen';
import IndexEmpleado from '../screens/empleado/IndexEmpleado';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const LoginStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrarScreen" component={RegistrarScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default function EmpleadoNavigator() {
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
                if (route.name === "IndexEmpleado") {
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

            <Tab.Screen name="IndexEmpleado" component={IndexEmpleado} />
        </Tab.Navigator>
    );
};