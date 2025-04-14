import React from 'react'
import Const from 'expo-constants';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import homeroImg from '../../assets/favicon.png';
import globalStyles from '../../styles/globalStyles';
import AdminLayout from '../../components/AdminLayout';
import { useNavigation } from "@react-navigation/native";


export default function IndexAdmin() {
    const navigation = useNavigation();

    const handlePress = (screen) => {
        navigation.navigate(screen);
    };

    return (
        <AdminLayout>
            <View style={styles.container}>
                <Image style={styles.img} source={homeroImg}></Image>
                <View style={styles.cardContainer}>
                    <Text style={styles.cardText}> Bienvenido Don oscar</Text>
                    <Text style={{ color: '#fff', fontSize: 14 }}> Estas son algunas de las funciones disponibles </Text>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle}>Ventas</Text>
                        <TouchableOpacity onPress={() => handlePress("Dashboard")}>
                            <Text style={styles.cardLinks}>Analisis de ventas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress("Ventas")}>
                            <Text style={styles.cardLinks}>Gestion de ventas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress("Pedidos")}>
                            <Text style={styles.cardLinks}>Pedidos</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle}>Recompensas</Text>
                        <TouchableOpacity onPress={() => handlePress("Recompensas")}>
                            <Text style={styles.cardLinks}>Recompensas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress("RecompensasObtenidas")}>
                            <Text style={styles.cardLinks}>Recompensas Obtenidas</Text>
                        </TouchableOpacity>
                    </View> <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle}>Gestion de usuarios</Text>
                        <TouchableOpacity onPress={() => handlePress("Clientes")}>
                            <Text style={styles.cardLinks}>Clientes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress("Empleados")}>
                            <Text style={styles.cardLinks}>Empleados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress("Proveedores")}>
                            <Text style={styles.cardLinks}>Proveedores</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <Text style={styles.cardTitle}>Usuarios Registrados</Text>
                    <Text style={{ alignSelf: 'center', marginVertical: 10, fontSize: 20, color: '#fff', fontWeight: 'bold' }}> 5 Usuarios Registrados</Text>
                    <Text style={[styles.cardLinks, { color: '#FFC107', alignSelf: 'center', left: 20, fontSize: 20, marginBottom: 10 }]}> + 2 este mes</Text>
                </View>

                <View style={styles.cardContainer}>
                    <Text style={styles.cardTitle}>Reseñas</Text>
                    <Text style={{ alignSelf: 'center', marginVertical: 10, fontSize: 20, color: '#fff', fontWeight: 'bold' }}> 4.6 promedio de reseñas</Text>
                    <Text style={{ color: '#FFC107', alignSelf: 'center', fontSize: 20, marginBottom: 10 }}> ⭐⭐⭐⭐⭐</Text>
                </View>
            </View>
        </AdminLayout>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Const.statusBarHeight
    },
    img: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 150,
        height: 150,
    },
    text: {
        fontSize: 30,
        flex: 1,
        marginHorizontal: 20,
        marginTop: 25,
        textAlign: 'center'
    },
    cardContainer: {
        borderColor: '#B7B7B7',
        borderWidth: 1,
        borderRadius: 8,
        width: '90%',
        marginTop: 15,
        paddingLeft: 10,
        paddingVertical: 15
    },
    cardText: {
        fontFamily: 'Homer-Simpson',
        fontSize: 35,
        color: '#FFC107',
    },
    cardInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 10
    },
    cardTitle: {
        fontSize: 20,
        color: '#FFC107',
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10

    },
    cardLinks: {
        color: '#fff',
        width: '50%',
        fontWeight: 'bold',
    }
});
