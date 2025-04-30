import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import homeroImg from '../../assets/favicon.png';
import AdminLayout from '../../components/AdminLayout';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import useClientes from '../../hooks/useClientes';


export default function IndexAdmin() {
    const navigation = useNavigation();
    const { data: clientesRegistrados } = useClientes("clientesRegistrados");
    const { data: clientes } = useClientes("clientesRegistradosTotales");
    const { data: resenasGoogle } = useClientes("resenasUsuarios");

    const handlePress = (screen) => {
        navigation.navigate(screen);
    };

    const renderEstrellas = (valor) => {
        const estrellasLlenas = Math.floor(valor);
        const tieneMedia = valor - estrellasLlenas >= 0.5;
        const estrellasTotales = 5;

        const estrellas = [];

        for (let i = 0; i < estrellasLlenas; i++) {
            estrellas.push(
                <Ionicons key={`full-${i}`} name="star" size={20} color="#FFC107" />
            );
        }

        if (tieneMedia) {
            estrellas.push(
                <Ionicons key="half" name="star-half" size={20} color="#FFC107" />
            );
        }

        const vacías = estrellasTotales - estrellas.length;
        for (let i = 0; i < vacías; i++) {
            estrellas.push(
                <Ionicons key={`empty-${i}`} name="star-outline" size={20} color="#FFC107" />
            );
        }

        return estrellas;
    };



    return (
        <AdminLayout>
            <View style={styles.container}>
                <Image style={styles.img} source={homeroImg}></Image>
                <View style={styles.cardContainer}>
                    <Text style={[styles.cardText, { marginHorizontal: 7 }]}> Bienvenido, Don oscar</Text>
                    <Text style={{ color: '#BDC3C7', fontSize: 14, marginHorizontal: 12 }}> Estas son algunas de las funciones disponibles </Text>
                </View>
                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.cardInfo} onPress={() => handlePress("Ventas")}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FF6B4A' }]}>
                            <Ionicons style={styles.icon} name="cash"></Ionicons>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.textTitle, { color: '#FF6B4A' }]}>Ventas</Text>
                            <Text style={styles.cardContentText}>Analisis de ventas, gestion de ventas y pedidos.</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cardInfo} onPress={() => handlePress("Recompensas")}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FFCE54' }]}>
                            <Ionicons style={styles.icon} name="gift"></Ionicons>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.textTitle, { color: '#FFCE54' }]}>Recompensas</Text>
                            <Text style={styles.cardContentText}>Gestion de recompensas y promociones.</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cardInfo} onPress={() => handlePress("Clientes")}>
                        <View style={[styles.iconContainer, { backgroundColor: '#4FC1E9' }]}>
                            <Ionicons style={styles.icon} name="people"></Ionicons>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.textTitle, { color: '#4FC1E9' }]}>Gestion de usuarios</Text>
                            <Text style={styles.cardContentText}>Clientes, empleados y proveedores.</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardStatsContainer}>
                    <View style={styles.cardStats} >
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFC107' }}>Clientes Registrados</Text>
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFC107' }}>{clientes.length}</Text>
                            <Text style={{ fontSize: 14, color: '#BDC3C7', paddingTop: 15, paddingLeft: 6 }}> Clientes</Text>
                        </View>
                        <Text style={{ color: '#BDC3C7', fontSize: 14, paddingTop: 10, fontWeight: 'bold' }}> Un {clientesRegistrados.length}% este mes</Text>
                    </View>

                    <View style={styles.cardStats}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFC107', alignSelf: 'flex-start', paddingLeft: 15 }}>Reseñas</Text>
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FFC107' }}>{resenasGoogle}</Text>
                            <Text style={{ fontSize: 14, color: '#BDC3C7', paddingTop: 15, paddingLeft: 0 }}>/ 5.0</Text>
                        </View>
                        <Text style={{ color: '#BDC3C7', fontSize: 14, paddingTop: 10, fontWeight: 'bold' }}>{renderEstrellas(resenasGoogle)}</Text>
                    </View>
                </View>
            </View>


        </AdminLayout >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        borderColor: '#4A5159',
        borderWidth: 1,
        borderRadius: 8,
        width: '90%',
        marginTop: 15,
        paddingVertical: 15,
        backgroundColor: '#3A4149',
    },
    cardText: {
        fontFamily: 'Homer-Simpson',
        fontSize: 32,
        color: '#FFC107',
    },
    cardInfo: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#343B42',
        marginVertical: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignSelf: 'center',
        width: '95%',
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 20,
        color: '#FFC107',
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10

    },
    cardLinks: {
        color: '#BDC3C7',
        width: '50%',
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    icon: {
        color: '#fff',
        fontSize: 28,
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 50
    },
    textContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 10
    },
    textTitle: {
        fontSize: 20,
        color: '#FFC107',
        fontWeight: 'bold',
    },
    cardContentText: {
        color: '#BDC3C7',
        fontSize: 12
    },
    cardStats: {
        display: 'flex',
        borderColor: '#4A5159',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#3A4149',
        width: '43%',
        height: 120,
        alignItems: 'center',
        marginHorizontal: 8,
        paddingVertical: 15
    },
    cardStatsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 15,
        justifyContent: 'space-between',
    }
});
