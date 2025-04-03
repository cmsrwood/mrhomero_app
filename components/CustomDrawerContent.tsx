import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import useAuth from '../hooks/useAuth';

export default function CustomDrawerContent({ navigation }) {
    const { user,logout } = useAuth();
    return (
        <DrawerContentScrollView contentContainerStyle={{ flex: 1, backgroundColor: "#1E1E1E" }}>
            <TouchableOpacity onPress={() => navigation.navigate("IndexAdmin")} style={{ padding: 20 }}>
                <Text style={{ color: "white", fontSize: 18 }}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Details")} style={{ padding: 20 }}>
                <Text style={{ color: "white", fontSize: 18 }}>Detalles</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => logout()} style={{ padding: 20 }}>
                <Text style={{ color: "red", fontSize: 18 }}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}
