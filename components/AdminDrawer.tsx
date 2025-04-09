import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import useAuth from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';

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
        <View style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
            <DrawerContentScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={[globalStyles.title, { fontSize: 40, paddingTop: 25 }]}>Mr. Homero</Text>

                <TouchableOpacity onPress={() => handlePress('inicio', 'IndexAdmin')} style={styles.buttons}>
                    <Ionicons name="home" style={[styles.icon, activeButton === 'inicio' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'inicio' && styles.active]}>  Inicio</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { toggleVentas(); setActiveButton('ventas'); }} style={styles.buttons}>
                    <Ionicons name={ventasExpanded ? "chevron-down" : "chevron-forward"} style={[styles.icon, activeButton === 'ventas' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'ventas' && styles.active]}>  Ventas</Text>
                    </Ionicons>
                </TouchableOpacity>

                {ventasExpanded && (
                    <View>
                        <TouchableOpacity onPress={() => handlePress('analisisVentas', 'Dashboard')} style={[styles.buttons, { paddingLeft: 20 }]}>
                            <Ionicons name="analytics" style={[styles.icon, activeButton === 'analisisVentas' && styles.active]}>
                                <Text style={[styles.text, activeButton === 'analisisVentas' && styles.active]}>  Analisis de ventas</Text>
                            </Ionicons>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress('gestionVentas', 'Ventas')} style={[styles.buttons, { paddingLeft: 20 }]}>
                            <Ionicons name="bar-chart" style={[styles.icon, activeButton === 'gestionVentas' && styles.active]}>
                                <Text style={[styles.text, activeButton === 'gestionVentas' && styles.active]}>  Gestion de ventas</Text>
                            </Ionicons>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress('pedidos', 'Pedidos')} style={[styles.buttons, { paddingLeft: 20 }]}>
                            <Ionicons name="wallet" style={[styles.icon, activeButton === 'pedidos' && styles.active]}>
                                <Text style={[styles.text, activeButton === 'pedidos' && styles.active]}>  Pedidos</Text>
                            </Ionicons>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity onPress={() => handlePress('inventario', 'Inventario')} style={styles.buttons}>
                    <Ionicons name="file-tray" style={[styles.icon, activeButton === 'inventario' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'inventario' && styles.active]}>  Inventario</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('menu', 'Menu')} style={styles.buttons}>
                    <Ionicons name="fast-food" style={[styles.icon, activeButton === 'menu' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'menu' && styles.active]}>  Menú</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('recompensas', 'Recompensas')} style={styles.buttons}>
                    <Ionicons name="gift" style={[styles.icon, activeButton === 'recompensas' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'recompensas' && styles.active]}>  Recompensas</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('recompensasObtenidas', 'RecompensasObtenidas')} style={styles.buttons}>
                    <Ionicons name="bag-check" style={[styles.icon, activeButton === 'recompensasObtenidas' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'recompensasObtenidas' && styles.active]}>  Recompensas Obtenidas</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress('clientes', 'Clientes')} style={styles.buttons}>
                    <Ionicons name="people" style={[styles.icon, activeButton === 'clientes' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'clientes' && styles.active]}>  Clientes</Text>
                    </Ionicons>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { toggleEmpleados(); setActiveButton('empleadosInfo'); }} style={styles.buttons}>
                    <Ionicons name={empleadosExpanded ? "chevron-down" : "chevron-forward"} style={[styles.icon, activeButton === 'empleadosInfo' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'empleadosInfo' && styles.active]}>  Info. Empleados</Text>
                    </Ionicons>
                </TouchableOpacity>

                {empleadosExpanded && (
                    <View>
                        <TouchableOpacity onPress={() => handlePress('empleados', 'Empleados')} style={[styles.buttons, { paddingLeft: 20 }]}>
                            <Ionicons name="person-circle" style={[styles.icon, activeButton === 'empleados' && styles.active]}>
                                <Text style={[styles.text, activeButton === 'empleados' && styles.active]}>  Empleados</Text>
                            </Ionicons>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handlePress('horas', 'HorasEmpleados')} style={[styles.buttons, { paddingLeft: 20 }]}>
                            <Ionicons name="time" style={[styles.icon, activeButton === 'horas' && styles.active]}>
                                <Text style={[styles.text, activeButton === 'horas' && styles.active]}>  Horas de empleados</Text>
                            </Ionicons>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity onPress={() => handlePress('proveedores', 'Proveedores')} style={styles.buttons}>
                    <Ionicons name="bag-add" style={[styles.icon, activeButton === 'proveedores' && styles.active]}>
                        <Text style={[styles.text, activeButton === 'proveedores' && styles.active]}>  Proveedores</Text>
                    </Ionicons>
                </TouchableOpacity>
            </DrawerContentScrollView>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => logout()} style={styles.buttons}>
                    <Ionicons name="log-out" style={styles.icon}>
                        <Text style={styles.text}>  Cerrar sesión</Text>
                    </Ionicons>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        color: "white",
        fontSize: 20,
    },
    text: {
        color: "white",
        fontSize: 20,
        alignContent: "center",
    },
    buttons: {
        paddingVertical: 13,
    },
    active: {
        backgroundColor: "gray",
        borderRadius: 10,
        padding: 10
    },
    footer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
    }
});