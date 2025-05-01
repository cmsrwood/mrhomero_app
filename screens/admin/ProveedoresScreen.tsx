import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native'
import { ActivityIndicator, Card } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import ProveedoresService from '../../services/ProveedoresService'
import useProveedores from '../../hooks/useProveedores'
import { useRoute } from '@react-navigation/native'
import Loader from '../../components/Loader';

export default function ProveedoresScreen() {
    const route = useRoute();
    const [modalAgregar, setModalAgregar] = useState(false);
    const [modalMostrar, setModalMostrar] = useState(false);

    const { id_proveedor } = route.params || {};
    const { data: proveedores, refetch } = useProveedores("proveedores", { id_proveedor });
    const [proveedor, setProveedor] = useState({
        prov_nombre: "",
        prov_direccion: "",
        prov_telefono: "",
        prov_correo: "",
    });


    return (
        <AdminLayout>
            <View>

                <View style={styles.up}>
                    <Text style={[globalStyles.title]}>proveedores</Text>
                    <TouchableOpacity style={styles.add}
                        onPress={
                            () => {
                                setModalAgregar(true);
                            }
                        }
                    >
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text style={styles.botonTexto} >Añadir</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>
                    {proveedores ? (
                        proveedores.map((proveedor) => (
                            <View key={proveedor.id_proveedor} style={styles.prov} >
                                <TouchableOpacity onPress={() => setModalMostrar(true)}>
                                    <View>
                                        <Text style={styles.text}>{proveedor.prov_nombre}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => editarProducto()} style={globalStyles.cardEdit}>
                                    <Ionicons name="create-outline" size={20} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={globalStyles.cardDelete}
                                    onPress={() => eliminarProducto(producto.id_producto)}>
                                    <Ionicons name="trash-outline" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                        ))
                    ) : (
                        <View>
                            <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>Cargando proveedores...</Text>
                            <Loader />
                        </View>
                    )

                    }

                </View>

                <Modal
                animationType="slide"
                transparent={true}
                visible={modalMostrar}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContenido}>

                            <TouchableOpacity style={globalStyles.botonCerrar} onPress={() => setModalMostrar(false)}>
                                <Ionicons name="close-circle" size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Detalles del proveedor</Text>
                            {proveedores.map((proveedor) => (
                                <View key={proveedor.id_proveedor}>
                                    <Text style={styles.modalText}>ID: {proveedor.id_proveedor}</Text>
                                    <Text style={styles.modalText}>Empresa: {proveedor.prov_nombre}</Text>
                                    <Text style={styles.modalText}>Contacto: {proveedor.prov_contacto_nombre}</Text>
                                    <Text style={styles.modalText}>Telefono: {proveedor.prov_contacto_telefono}</Text>
                                    <Text style={styles.modalText}>Direccion: {proveedor.prov_direccion}</Text>
                                    <Text style={styles.modalText}>Email: {proveedor.prov_contacto_email}</Text>
                                </View>
                            ))}

                        </View>
                    </View>
                </Modal>

            </View>


        </AdminLayout >
    )
}


const styles = StyleSheet.create({

    up: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50,
        gap: 20,
    },
    add: {
        width: 120,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#157347',
    },
    botonTexto: {
        color: '#fff',
        fontSize: 16
    },
    container: {
        alignItems: 'center',
    },
    prov: {
        backgroundColor: '#3A4149',
        width: '90%',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        height: 100,
        alignItems: 'center',
        justifyContent: 'space-around',
        display: 'flex',
        flexDirection: 'row',

    },
    row: {

        justifyContent: 'center',
        width: 100,

    },
    text: {
        fontFamily: "Homer-Simpson",
        fontSize: 50,
        color: "#FFC107",
    },
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
        height: '45%',
        padding: 20,
        backgroundColor: '#2B3035',
        borderRadius: 15,

    },
    modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 5,
        color: '#ccc',
    },
    modalButton: {
        width: 100,
        height: 50,
        backgroundColor: '#DC3545',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        marginTop: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16
    },
})
