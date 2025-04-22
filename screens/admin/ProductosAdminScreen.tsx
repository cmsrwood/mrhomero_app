import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { useRoute } from '@react-navigation/native';
import Loader from '../../components/Loader';
import globalStyles from '../../styles/globalStyles';
import useMenu from '../../hooks/useMenu';

export default function ProductosAdminScreen() {
    const route = useRoute();
    const { id_producto, pro_nom } = route.params || {};
    const { data: producto, refetch, isLoading: isProductoloading, error } = useMenu("producto", { id_producto })

    //Funcion para convertir numeros a formato de moneda Colombiana COP
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    }

    useEffect(() => {
        refetch()
    }, [id_producto]);

    return (
        <AdminLayout>
            <View style={styles.content}>
                {isProductoloading || !producto ? (
                    <View>
                        <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>Cargando producto...</Text>
                        <Loader />
                    </View>
                ) : (
                    <View key={producto.id_producto}>
                        <Text style={globalStyles.title}>{pro_nom}</Text>
                        <View >
                            <Image source={{ uri: producto.pro_foto }} style={styles.image} />
                        </View>
                        <View style={styles.desp}>
                            <Text style={styles.desc}>{producto.pro_desp}</Text>
                            <Text style={styles.puntos}>Puntos: {producto.pro_puntos}</Text>
                            <Text style={styles.precio}>
                                {formatCurrency(producto.pro_precio)}
                            </Text>
                            <View style={styles.estado}>
                                <Text style={styles.textEstado}>Estado: </Text>
                                {producto.pro_estado === 1 ? (
                                    <Text style={styles.activo}>Activo</Text>
                                ) : (
                                    <Text style={styles.inactivo}>Inactivo</Text>
                                )
                                }
                            </View>

                        </View>
                    </View>
                )}

            </View>
        </AdminLayout>
    )
}
const styles = StyleSheet.create({
    content: {
        marginTop: 100,
        padding: 10,
    },
    image: {
        alignSelf: 'center',
        width: 340,
        height: 340,
        borderColor: '#B7B7B7',
    },
    desp: {
        marginLeft: 20,
        marginTop: 10,
        gap: 8
    },
    desc: {
        color: '#fff',
        fontSize: 20
    },
    puntos: {
        color: '#ccc',
        fontSize: 20
    },
    precio: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FEBA17'
    },
    estado:{
        display: 'flex',
        flexDirection: 'row',
    },
    textEstado:{
        color: '#ccc',
        fontSize: 20
    },
    activo: {
        color: '#157347',
        fontSize: 20,
    },
    inactivo: {
        color: '#BB2D3B',
        fontSize: 20,
    }

})
