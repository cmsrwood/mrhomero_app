import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import useMenu from '../../hooks/useMenu'
import useClientes from '../../hooks/useClientes'
import { Ionicons } from '@expo/vector-icons'

export default function PedidosScreen() {
    const [productoID, setProductoID] = useState('');
    const { data: categorias, refetch } = useMenu("categorias");
    const { data: productos, refetch: refetchProductos } = useMenu("productos", { id_categoria: productoID });
    const { data: clientes, refetch: refetchClientes } = useClientes("clientes");

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    //Toma el id de la categoria y refresca los productos
    function verProductos(id) {
        setProductoID(id);
        refetchProductos();
    }

    const [modalCliente, setModalCliente] = useState(false);

    const [busqueda, setBusqueda] = useState('');
    const clientesFiltrados = (clientes || [])
        .filter(usuario => {
            const nombres = `${usuario.user_nom} ${usuario.user_apels}`;
            const correo = usuario.user_email;

            return (
                nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
                correo.toLowerCase().includes(busqueda.toLowerCase())
            )
        })
    useEffect(() => {
        refetchClientes();
    }, [busqueda])

    const seleccionarCliente = (cliente) => {
        setClienteSeleccionado({
            ...cliente,
            id_user: cliente.id_user,
            user_nom: `${cliente.user_nom} `,
            user_apels: `${cliente.user_apels}`
        })
    }

    return (
        <AdminLayout>
            <View style={styles.container}>
                <Text style={[globalStyles.title]}>Pedidos</Text>
                <View style={styles.content}>
                    { /*Scroll para las categorias*/}
                    {categorias.length === 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay productos en esta categoria</Text>}
                    <ScrollView style={{ width: '100%' }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {categorias.map((categorias) => (
                            <TouchableOpacity key={categorias.id_categoria} style={[styles.cardCategorias, { backgroundColor: categorias.id_categoria === productoID ? '#FFC107' : '#3A4149' }]} onPress={() => verProductos(categorias.id_categoria)}>
                                <Text style={[styles.textCardCategorias, { color: categorias.id_categoria === productoID ? '#3A4149' : '#ccc' }]}>{categorias.cat_nom}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    { /*Scroll para los productos*/}
                    {productos.length === 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", flex: 1 }}>No hay productos en esta categoria</Text>}
                    <ScrollView style={{ width: '100%' }} horizontal={true}>
                        {productos.map((producto) => (
                            <TouchableOpacity key={producto.id_producto} style={styles.card}>
                                <Image source={{ uri: producto.pro_foto }} style={styles.image}></Image>
                                <Text style={styles.textCard}>{producto.pro_nom}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.clienteInfo}>
                        <Text style={{ color: '#ccc', fontWeight: 'bold', marginTop: 10 }}>{clienteSeleccionado ? `${clienteSeleccionado.user_nom} ${clienteSeleccionado.user_apels}` : 'Seleccione un cliente'}</Text>
                        <TouchableOpacity style={styles.buttonAdd} onPress={() => setModalCliente(true)}>
                            <Text style={{ color: '#ccc', fontWeight: 'bold' }}>Añadir Cliente</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={modalCliente}
                            transparent={true}
                            animationType='slide'
                        >
                            <View style={styles.modal}>
                                <View style={styles.modalContent}>
                                    <Text style={[globalStyles.title, { fontSize: 40 }]}> Añadir Cliente</Text>
                                    <TextInput placeholder='Buscar Cliente ...' placeholderTextColor={'#ccc'} style={styles.input} value={busqueda} onChangeText={setBusqueda}>
                                    </TextInput>
                                    <ScrollView style={{ height: '100%' }} contentContainerStyle={{ flexGrow: 1 }} horizontal={true}>
                                        <ScrollView style={{ height: '100%' }}>
                                            <View style={styles.headerTable}>
                                                <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>ID</Text></View>
                                                <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Nombres</Text></View>
                                                <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Apellidos</Text></View>
                                                <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Email</Text></View>
                                                <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Añadir</Text></View>
                                            </View>
                                            {clientesFiltrados.map((clientes) => (
                                                <View style={styles.row} key={clientes.id_user}>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: clientes.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{clientes.id_user}</Text></View>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: clientes.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{clientes.user_nom}</Text></View>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: clientes.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{clientes.user_apels}</Text></View>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: clientes.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{clientes.user_email}</Text></View>
                                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} onPress={() => seleccionarCliente(clientes)}>
                                                        <Ionicons name="add-circle-outline" size={30} color="#198754" style={{ alignSelf: 'center', justifyContent: 'center' }}></Ionicons>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}

                                        </ScrollView>
                                    </ScrollView>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: '#198754', width: 80, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => setModalCliente(false)}>
                                            <Text style={{ color: '#ccc', fontWeight: 'bold' }}>Hecho!</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </View >
        </AdminLayout >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    content: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderWidth: 1,
        borderColor: '#4A5159',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 8,
        alignItems: 'center',
        height: 100,
        marginBottom: "13%"
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 5,
        borderBlockColor: '#4A5159',
        paddingBottom: 10,
    },
    textCard: {
        color: '#ccc',
        fontSize: 11,
        marginTop: 5,
        fontWeight: 'bold',
        maxWidth: 90,
        textAlign: 'center'
    },
    cardCategorias: {
        borderWidth: 1,
        borderColor: '#4A5159',
        backgroundColor: '#3A4149',
        borderRadius: 8,
        marginHorizontal: 8,
        marginBottom: 20,
        padding: 10,
        alignSelf: 'center',
    },
    textCardCategorias: {
        color: '#ccc',
        fontSize: 15,
        marginTop: 3,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    clienteInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 8,
        padding: 10
    },
    buttonAdd: {
        backgroundColor: '#198754',
        padding: 10,
        borderRadius: 8
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: '100%',
    },
    modalContent: {
        width: '100%',
        height: 500,
        backgroundColor: '#3A4149',
        padding: 20,
        borderRadius: 15
    },
    headerTable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        backgroundColor: '#2B3035',
        borderWidth: 1,
        borderColor: '#4A5159',
        borderStartStartRadius: 8,
        borderStartEndRadius: 8,
        paddingVertical: 8,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#4A5159',
        paddingVertical: 8,
    },
    cell: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 3
    },
    cellText: {
        color: '#BDC3C7',
        fontSize: 12,
        textAlign: 'center'
    },
    input: {
        alignSelf: 'flex-end',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#ffc107',
        width: '60%',
        height: 40,
        padding: 10,
        color: '#fff',
        marginBottom: 10
    }
})
