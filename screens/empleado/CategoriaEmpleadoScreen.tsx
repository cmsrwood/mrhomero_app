import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import useMenu from "../../hooks/useMenu";
import { useRoute } from '@react-navigation/native';
import Loader from '../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import ProductosService from '../../services/ProductosServices';
import ImagenesService from '../../services/ImagenesService';
import { ActivityIndicator } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function CategoriaScreen() {
    const route = useRoute();
    const [isUploading, setIsUploading] = useState(false);
    const { id_categoria, cat_nom } = route.params || {};
    const navigation = useNavigation();
    const { data: productos, refetch, isLoading: isProductosloading, error } = useMenu("productos", { id_categoria })
    const [estadoFiltro, setEstadoFiltro] = useState(1);
    function filtrarProductosPorEstado(estado) {
        refetch();
        setEstadoFiltro(Number(estado));
    }
    const productosFiltrados = productos.filter(producto =>
        estadoFiltro === -1 || producto.pro_estado === estadoFiltro
    );

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [id_categoria])
    );


    return (
        <AdminLayout>
            <View style={styles.general && styles.container}>
                <Text style={globalStyles.title}>{cat_nom}</Text>
                {/*Contenido */}
                <View >
                    {isProductosloading || !productos ? (
                        <View>
                            <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>Cargando productos...</Text>
                            <Loader />
                        </View>
                    ) : (

                        <View style={globalStyles.row}>
                            {productosFiltrados.map((producto) => (
                                <View key={producto.id_producto} style={globalStyles.card}>
                                    <TouchableOpacity key={producto.id_producto} onPress={() => navigation.navigate('Producto', { id_producto: producto.id_producto, pro_nom: producto.pro_nom })}>
                                        <Image style={globalStyles.img} source={{ uri: producto.pro_foto }} />
                                    </TouchableOpacity>
                                    <View style={globalStyles.cardContent}>
                                        <Text style={globalStyles.cardText}>{producto.pro_nom}</Text >
                                    </View>
                                </View>
                            ))}
                        </View>

                    )
                    }
                </View>
            </View>

        </AdminLayout>

    )
}
const styles = StyleSheet.create({
    general: {
        padding: 10,
    },
    up: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    add: {
        width: 170,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#157347',
    },
    picker: {
        color: '#fff',
        backgroundColor: '#565E64',
        height: 50,
        width: 170,
        fontSize: 16,
        borderRadius: 10,
    },
    container: {
        marginTop: 50
    },
    //Estilos para el modal de agregar 
    // Estilos para el fondo del modal
    modalContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Estilos para el contenido del modal
    modalContenido: {
        width: 330,
        height: '85%',
        padding: 20,
        backgroundColor: '#2B3035',
        borderRadius: 15,

    },
    //Estilos para el titulo del modal
    modalTitulo: {
        fontFamily: "Homer-Simpson",
        fontSize: 40,
        color: "#FFC107",
    },
    // Estilos para el label de la imagen
    modalLabel: {
        marginTop: 10,
        fontSize: 15,
        color: '#fff',
    },
    //Estilos para la sección de la imagen
    imageSection: {
        marginBottom: 20,
    },
    // Estilos para el label que acompaña la imagen
    sectionLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 8,
    },
    //Estilos para el input de la imagen
    imageUploadButton: {
        marginVertical: 15,
        height: 150,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    //Estilos para la imagen previa
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    //Estilos para el placeholder de la imagen (se usa en caso de que no se haya seleccionado ninguna imagen)
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    //Estilos para el texto del placeholder que aparece cuando no se ha seleccionado ninguna imagen
    placeholderText: {
        marginTop: 8,
        color: '#aaa',
        fontSize: 14,
    },
    //Estilos para el input del nombre
    modalInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        height: 40,
        width: '100%',
        borderRadius: 15,
        padding: 10,
        marginBottom: 5,
        marginTop: 5,
        color: '#fff'
    },
    //Estilos para las acciones del modal
    Botones: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'flex-end',
    },
    //Estilos para el boton de cancelar
    cancelar: {
        width: 100,
        height: 50,
        backgroundColor: '#DC3545',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        marginTop: 5,
    },
    //Estilos para el boton de guardar
    guardar: {
        width: 100,
        height: 50,
        backgroundColor: '#198754',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        marginTop: 5,
    },
    //Estilos para el texto de los botones
    botonTexto: {
        color: '#fff',
        fontSize: 16
    },

});

