import AdminDrawer from '../components/AdminDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Categoria from '../screens/admin/CategoriaScreen';
import Clientes from '../screens/admin/ClientesScreen';
import Dashboard from '../screens/admin/DashboardScreen';
import Details from '../screens/admin/DetailsScreen';
import Empleados from '../screens/admin/EmpleadosScreen';
import GestionHoras from '../screens/admin/GestionHorasScreen';
import HorasEmpleados from '../screens/admin/HorasEmpleadosScreen';
import IndexAdmin from '../screens/admin/IndexAdminScreen';
import Inventario from '../screens/admin/InventarioScreen';
import Menu from '../screens/admin/MenuAdminScreen';
import Pedidos from '../screens/admin/PedidosScreen';
import Productos from '../screens/admin/ProductosAdminScreen';
import Proveedores from '../screens/admin/ProveedoresScreen';
import Recompensas from '../screens/admin/RecompensasAdminScreen';
import RecompensasObtenidas from '../screens/admin/RecompensasObtenidasScreen';
import Ventas from '../screens/admin/VentasScreen';

const Drawer = createDrawerNavigator();

export default function AdminNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <AdminDrawer {...props} />}
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
            <Drawer.Screen name="IndexAdmin" component={IndexAdmin} />
            <Drawer.Screen name="Categoria" component={Categoria} />
            <Drawer.Screen name="Clientes" component={Clientes} />
            <Drawer.Screen name="Dashboard" component={Dashboard} />
            <Drawer.Screen name="Details" component={Details} />
            <Drawer.Screen name="Empleados" component={Empleados} />
            <Drawer.Screen name="GestionHoras" component={GestionHoras} />
            <Drawer.Screen name="HorasEmpleados" component={HorasEmpleados} />
            <Drawer.Screen name="Inventario" component={Inventario} />
            <Drawer.Screen name="Menu" component={Menu} />
            <Drawer.Screen name="Pedidos" component={Pedidos} />
            <Drawer.Screen name="Productos" component={Productos} />
            <Drawer.Screen name="Proveedores" component={Proveedores} />
            <Drawer.Screen name="Recompensas" component={Recompensas} />
            <Drawer.Screen name="RecompensasObtenidas" component={RecompensasObtenidas} />
            <Drawer.Screen name="Ventas" component={Ventas} />
        </Drawer.Navigator>
    );
}
