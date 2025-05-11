import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import useAuth from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';
import Constants from 'expo-constants';
import homeroImg from '../assets/favicon.png';

export default function CustomDrawerContent({ navigation }) {
    const { user, logout } = useAuth();
    const [ventasExpanded, setVentasExpanded] = useState(false);
    const [empleadosExpanded, setEmpleadosExpanded] = useState(false);
    const [activeButton, setActiveButton] = useState(null);

    const toggleVentas = () => setVentasExpanded(!ventasExpanded);
    const toggleEmpleados = () => setEmpleadosExpanded(!empleadosExpanded);

    const handlePress = (buttonId, navigationTo) => {
        setActiveButton(buttonId);
        if (navigationTo) navigation.navigate(navigationTo);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#2B3035", paddingTop: Constants.statusBarHeight }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 15 }}>
                <Image style={{ width: 50, height: 50, marginTop: 25 }} source={homeroImg}></Image>
                <View style={{ flexDirection: "column", paddingLeft: 10 }}>
                    <Text style={[globalStyles.title, { fontSize: 30, marginTop: Constants.statusBarHeight }]}>Mr. Homero</Text>
                    <Text style={{ color: "#BDC3C7", marginTop: -20, fontSize: 12 }}> Empleado</Text>
                </View>
            </View>

            <DrawerContentScrollView>
                <Text style={styles.divider}></Text>
                <Text style={styles.dividerText}>PRINCIPAL</Text>

                <TouchableOpacity onPress={() => handlePress('analisisVentas', 'AnalisisVentas')} style={[styles.buttons, { backgroundColor: activeButton === 'analisisVentas' ? 'rgba(255, 107, 74, 0.2)' : '#2B3035' }]}>
                    <Ionicons name="analytics" style={[styles.icon, { color: "#FF6B4A" }, activeButton === 'analisisVentas' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'analisisVentas' && styles.active]}>  Analisis de ventas</Text>
                    </Ionicons>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('gestionVentas', 'GestionVentas')} style={[styles.buttons, { backgroundColor: activeButton === 'gestionVentas' ? 'rgba(255, 107, 74, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'gestionVentas' ? "bar-chart" : "bar-chart-outline"} style={[styles.icon, { color: "#FF6B4A" }, activeButton === 'gestionVentas' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'gestionVentas' && styles.active]}>  Gestion de ventas</Text>
                    </Ionicons>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('pedidos', 'PedidosEmpleado')} style={[styles.buttons, { backgroundColor: activeButton === 'pedidos' ? 'rgba(255, 107, 74, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'pedidos' ? "wallet" : "wallet-outline"} style={[styles.icon, { color: "#FF6B4A" }, activeButton === 'pedidos' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'pedidos' && styles.active]}>  Pedidos</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('inventario', 'Inventario')} style={[styles.buttons, { backgroundColor: activeButton === 'inventario' ? 'rgba(255, 107, 74, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'inventario' ? "file-tray-full" : "file-tray-full-outline"} style={[styles.icon, { color: "#FF6B4A" }, activeButton === 'inventario' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'inventario' && styles.active]}>  Inventario</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('menu', 'Menu')} style={[styles.buttons, { backgroundColor: activeButton === 'menu' ? 'rgba(255, 107, 74, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'menu' ? "fast-food" : "fast-food-outline"} style={[styles.icon, { color: "#FF6B4A" }, activeButton === 'menu' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'menu' && styles.active]}>  Menú</Text>
                    </Ionicons>
                </TouchableOpacity>

                <Text style={styles.divider}></Text>
                <Text style={styles.dividerText}>RECOMPENSAS</Text>

                <TouchableOpacity onPress={() => handlePress('recompensas', 'Recompensas')} style={[styles.buttons, { backgroundColor: activeButton === 'recompensas' ? 'rgba(255, 206, 84, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'recompensas' ? "gift" : "gift-outline"} style={[styles.icon, { color: "#FFCE54" }, activeButton === 'recompensas' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'recompensas' && styles.active]}>  Recompensas</Text>
                    </Ionicons>
                </TouchableOpacity>

                <Text style={styles.divider}></Text>
                <Text style={styles.dividerText}>USUARIOS</Text>

                <TouchableOpacity onPress={() => handlePress('clientes', 'Clientes')} style={[styles.buttons, { backgroundColor: activeButton === 'clientes' ? 'rgba(79, 193, 233, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'clientes' ? "people" : "people-outline"} style={[styles.icon, { color: "#4FC1E9" }, activeButton === 'clientes' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'clientes' && styles.active]}>  Clientes</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('horasEmpleado', 'Horas')} style={[styles.buttons, { backgroundColor: activeButton === 'horasEmpleado' ? 'rgba(79, 193, 233, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'horasEmpleado' ? "alarm" : "alarm-outline"} style={[styles.icon, { color: "#4FC1E9" }, activeButton === 'horasEmpleado' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'horasEmpleado' && styles.active]}>  Horas</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('proveedores', 'Proveedores')} style={[styles.buttons, { backgroundColor: activeButton === 'proveedores' ? 'rgba(79, 193, 233, 0.2)' : '#2B3035' }]}>
                    <Ionicons name={activeButton === 'proveedores' ? "bag-add" : "bag-add-outline"} style={[styles.icon, { color: "#4FC1E9" }, activeButton === 'proveedores' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'proveedores' && styles.active]}>  Proveedores</Text>
                    </Ionicons>
                </TouchableOpacity>
            </DrawerContentScrollView>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => logout()} style={styles.buttons}>
                    <Ionicons name="log-out" style={styles.iconRed}>
                        <Text style={styles.textRed}>  Cerrar sesión</Text>
                    </Ionicons>
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    icon: {
        color: "white",
        fontSize: 20,
    },
    iconRed: {
        color: "#FF6B4A",
        fontSize: 20,
    },
    text: {
        color: "white",
        fontSize: 26,
        alignContent: "center",
        fontFamily: 'Homer-Simpson',
    },
    textRed: {
        color: "#FF6B4A",
        fontSize: 26,
        alignContent: "center",
        fontFamily: 'Homer-Simpson',
    },
    buttons: {
        paddingVertical: 13,
        alignItems: "flex-start",
        borderRadius: 10
    },
    active: {
        padding: 2,
        width: "100%",
        alignItems: "flex-start",
        paddingLeft: 5

    },
    footer: {
        padding: 10,
        paddingLeft: 20,
        borderTopWidth: 1,
        borderTopColor: '#0003',
        backgroundColor: "#343B42",
        alignItems: "flex-start",
        height: 70
    },
    divider: {
        height: 1,
        backgroundColor: '#4A5159',
        marginVertical: 10,
    },
    dividerText: {
        color: '#6C7883',
        fontSize: 11
    }
});