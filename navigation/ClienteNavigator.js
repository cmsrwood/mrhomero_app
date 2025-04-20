import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import MenuDefaultScreen from '../screens/default/MenuDefaultScreen';
import CategoriaScreen from '../screens/default/CategoriaScreen';
import ProductoScreen from '../screens/default/ProductoScreen';
import IndexCliente from '../screens/cliente/IndexCliente';
import RecompensasCliente from '../screens/cliente/RecompensasCliente';
import PerfilCliente from '../screens/cliente/PerfilCliente';
import HistorialCliente from '../screens/cliente/HistorialCliente';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MenuStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MenuScreen" component={MenuDefaultScreen} />
        <Stack.Screen name="CategoriatScreen" component={CategoriaScreen} />
        <Stack.Screen name="ProductoScreen" component={ProductoScreen} />
    </Stack.Navigator>
);

const RecompensasStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RecompensasScreen" component={RecompensasCliente} />
    </Stack.Navigator>
)

export default function ClienteNavigator() {
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
                    } else if (route.name === "Recompensas") {
                        iconName = focused ? "gift" : "gift-outline";
                    } else if (route.name === "Historial") {
                        iconName = focused ? "time" : "time-outline";
                    } else if (route.name === "Perfil") {
                        iconName = focused ? "person-circle" : "person-circle-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#B0B0B0",
            })}
        >
            <Tab.Screen name="Inicio" component={IndexCliente} />
            <Tab.Screen name="Menu" component={MenuStack} />
            <Tab.Screen name="Historial" component={HistorialCliente} />
            <Tab.Screen name="Recompensas" component={RecompensasStack} />
            <Tab.Screen name="Perfil" component={PerfilCliente} />
        </Tab.Navigator>
    );
}
