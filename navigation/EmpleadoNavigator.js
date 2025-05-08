
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import EmpleadoDrawer from '../components/EmpleadoDrawer';
import VentasEmpleado from '../screens/admin/VentasScreen';
import AnalisisVentasEmpleado from '../screens/admin/DashboardScreen';
import GestionVentasEmpleado from '../screens/admin/VentasScreen';
import InventarioEmpleado from '../screens/admin/InventarioScreen';
import MenuEmpleado from '../screens/empleado/MenuEmpleadoScreen';
import RecompensasEmpleado from '../screens/admin/RecompensasAdminScreen';
import ClientesEmpleado from '../screens/empleado/ClientesEmpleadoScreen';
import ProveedoresEmpleado from '../screens/admin/ProveedoresScreen';
import HorasEmpleado from '../screens/empleado/HorasEmpleadoScreen';
import PedidosEmpleado from '../screens/admin/PedidosScreen'
import CategoriaEmpleado from '../screens/empleado/CategoriaEmpleadoScreen';
import ProductoEmpleado from '../screens/admin/ProductoAdminScreen';

const Drawer = createDrawerNavigator();


export default function EmpleadoNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <EmpleadoDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: "#1E1E1E",
                    width: 250,
                },
                drawerActiveTintColor: "#FFD700",
                drawerInactiveTintColor: "#FFFFFF",
            }}
        >
            <Drawer.Screen name="PedidosEmpleado" component={PedidosEmpleado} />
            <Drawer.Screen name="VentasEmpleado" component={VentasEmpleado} />
            <Drawer.Screen name="AnalisisVentas" component={AnalisisVentasEmpleado} />
            <Drawer.Screen name="GestionVentas" component={GestionVentasEmpleado} />
            <Drawer.Screen name="Inventario" component={InventarioEmpleado} />
            <Drawer.Screen name="Menu" component={MenuEmpleado} />
            <Drawer.Screen name="Recompensas" component={RecompensasEmpleado} />
            <Drawer.Screen name="Clientes" component={ClientesEmpleado} />
            <Drawer.Screen name="Proveedores" component={ProveedoresEmpleado} />
            <Drawer.Screen name="Horas" component={HorasEmpleado} />
            <Drawer.Screen name="Categoria" component={CategoriaEmpleado} />
            <Drawer.Screen name="Producto" component={ProductoEmpleado} />
        </Drawer.Navigator>
    )
};