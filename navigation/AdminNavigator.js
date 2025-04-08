import AdminDrawer from '../components/AdminDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import IndexAdmin from '../screens/admin/IndexAdmin';
import Details from '../screens/admin/Details';
import Dashboard from '../screens/admin/Dashboard';

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
            <Drawer.Screen name="Details" component={Details} />
            <Drawer.Screen name="Dashboard" component={Dashboard} />
        </Drawer.Navigator>
    );
}
