import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, Platform } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import useMenu from '../../hooks/useMenu'
import useClientes from '../../hooks/useClientes'
import { Ionicons } from '@expo/vector-icons'
import VentasService from '../../services/VentasService'
import moment from 'moment'
import ClientesService from '../../services/ClientesServices'
import { showMessage } from 'react-native-flash-message'
import { Picker } from '@react-native-picker/picker'

export default function PedidosScreen() {
    const [productoID, setProductoID] = useState('');
    const { data: categorias, refetch: refetchCategorias } = useMenu("categorias");
    const { data: productos, refetch: refetchProductos } = useMenu("productos", { id_categoria: productoID });
    const { data: clientes, refetch: refetchClientes } = useClientes("clientes");

    const [venta, setVenta] = useState([]);
    const [ventaPrevia, setVentaPrevia] = useState([]);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [cantidadRecibida, setCantidadRecibida] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [modalCliente, setModalCliente] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [modalPedido, setModalPedido] = useState(false);
    const [steps, setSteps] = useState(0);

    const anadirProducto = async (producto) => {
        const productoExistente = venta.find(item => item.id_producto === producto.id_producto);

        if (productoExistente) {
            setVenta(venta.map(item => item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + 1 } : item));
        }
        else {
            setVenta([...venta, { ...producto, cantidad: 1 }]);
        }
    }

    const sumarCantidad = async (producto) => {
        const productoExistente = venta.find(item => item.id_producto === producto.id_producto);

        if (productoExistente) {
            setVenta(venta.map(item => item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + 1 } : item));
        }

        else {
            setVenta([...venta, { ...producto, cantidad: 1 }]);
        }
    }

    const restarCantidad = async (producto) => {
        const productoExistente = venta.find(item => item.id_producto === producto.id_producto);

        if (productoExistente.cantidad === 1) {
            setVenta(venta.filter(item => item.id_producto !== producto.id_producto));
        }
        else {
            setVenta(venta.map(item => item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad - 1 } : item));
        }
    }

    //Toma el id de la categoria y refresca los productos
    function verProductos(id) {
        setProductoID(id);
        refetchProductos();
    }

    const refetchAll = async () => {
        refetchCategorias();
        refetchProductos();
        refetchClientes();
    }

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

    const openModalPedido = async () => {
        if (venta.length === 0) {
            showMessage({
                message: 'No hay productos en el pedido',
                type: 'danger',
                icon: 'danger',
                duration: 3000
            })
            return;
        }

        if (clienteSeleccionado === null) {
            showMessage({
                message: 'No hay cliente seleccionado',
                type: 'warning',
                icon: 'warning',
                duration: 3000
            })
        }

        setModalPedido(true);
    }

    const handleSubmit = async () => {
        try {
            if (venta.length === 0) {
                Alert.alert('Error', 'No hay productos en el pedido');
                return;
            }

            if (parseInt(cantidadRecibida) <= 0) {
                Alert.alert('Error', 'La cantidad recibida debe ser mayor a 0');
                return;
            }

            if (parseInt(cantidadRecibida) < venta.reduce((total, producto) => total + (producto.pro_precio * producto.cantidad), 0)) {
                Alert.alert('Error', 'La cantidad recibida es menor al total a pagar');
                return;
            }

            if (clienteSeleccionado === null) {
                Alert.alert('Error', 'No hay cliente seleccionado');
                return;
            }

            const data = {
                id_user: clienteSeleccionado ? clienteSeleccionado.id_user : null,
                venta_total: venta.reduce((total, producto) => total + (producto.pro_precio * producto.cantidad), 0),
                venta_metodo_pago: metodoPago,
                venta_fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
            }

            const ventaRes = await VentasService.crearVenta(data);

            if (ventaRes.status === 200) {
                setVentaPrevia(venta);
                const id_venta = ventaRes.data.id
                const detalles = venta.map(async (producto) => {
                    const detalleVenta = {
                        id_venta: id_venta,
                        id_producto: producto.id_producto,
                        cantidad: producto.cantidad,
                        precio_unitario: producto.pro_precio,
                        subtotal: producto.pro_precio * producto.cantidad
                    };
                    return VentasService.crearDetalleVenta(detalleVenta);
                });
                if (clienteSeleccionado !== null) {
                    const puntos = venta.map(async (producto) => {
                        const data = {
                            id_user: clienteSeleccionado.id_user,
                            puntos: producto.pro_puntos * producto.cantidad
                        };
                        ClientesService.agregarPuntos(data);
                    });
                    await Promise.all(puntos);
                }

                await Promise.all(detalles);
                setVenta([]);
                refetchAll();
                setClienteSeleccionado(null);
                setSteps(1);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const formatNumber = (value) => {
        const formattedValue = value.toString().replace(/\D/g, '');
        return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

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
                            <TouchableOpacity onPress={() => { anadirProducto(producto) }} key={producto.id_producto} style={styles.card}>
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
                            onRequestClose={() => setModalCliente(false)}
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
                                            {clientesFiltrados.map((cliente) => (
                                                <View style={styles.row} key={cliente.id_user}>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: cliente.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{cliente.id_user}</Text></View>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: cliente.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{cliente.user_nom}</Text></View>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: cliente.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{cliente.user_apels}</Text></View>
                                                    <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: cliente.id_user === clienteSeleccionado?.id_user ? '#198754' : '#ccc' }]}>{cliente.user_email}</Text></View>
                                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} onPress={() => seleccionarCliente(cliente)}>
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
                    <View style={{ width: '80%', marginVertical: 10 }}>
                        <ScrollView horizontal={true} style={{ maxHeight: 230 }} contentContainerStyle={{ flexGrow: 1 }}>
                            <ScrollView style={{ height: '100%' }}>
                                <View style={styles.headerTable}>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Cantidad</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Producto</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Puntos</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Subtotal</Text></View>
                                </View>
                                {venta.length === 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay productos en el pedido</Text>}
                                {venta.map((producto) => (
                                    <View style={styles.row} key={producto.id_producto}>
                                        <View style={[styles.cell, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginRight: 10 }} onPress={() => { restarCantidad(producto) }}>
                                                <Ionicons name="remove-circle-outline" size={30} color="#198754" style={{ alignSelf: 'center', justifyContent: 'center' }}></Ionicons>
                                            </TouchableOpacity>
                                            <Text style={[styles.cellText, { fontSize: 14, color: '#fff' }]}>{producto.cantidad}</Text>
                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginLeft: 10 }} onPress={() => { sumarCantidad(producto) }}>
                                                <Ionicons name="add-circle-outline" size={30} color="#198754" style={{ alignSelf: 'center', justifyContent: 'center' }}></Ionicons>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.cell]}>
                                            <Text style={[styles.cellText, { fontSize: 14, color: '#fff', alignSelf: 'center' }]}>{producto.pro_nom}</Text>
                                        </View>
                                        <View style={[styles.cell]}>
                                            <Text style={[styles.cellText, { fontSize: 14, color: '#fff', alignSelf: 'center' }]}>{producto.pro_puntos * producto.cantidad}</Text>
                                        </View>
                                        <View style={[styles.cell]}>
                                            <Text style={[styles.cellText, { fontSize: 14, color: '#fff', alignSelf: 'center' }]}>{formatNumber(producto.pro_precio * producto.cantidad)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </ScrollView>
                    </View>
                </View>
            </View >
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
                <Text style={[styles.label, { fontSize: 20 }]}>Total a pagar</Text>
                <Text style={[globalStyles.title, { fontSize: 40 }]}>{formatNumber(venta.reduce((total, producto) => total + (producto.pro_precio * producto.cantidad), 0))}</Text>
            </View>
            <TouchableOpacity onPress={() => { openModalPedido() }} style={{ backgroundColor: '#198754', width: '80%', height: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 8, marginBottom: 20 }}>
                <Text style={{ color: '#ccc', fontWeight: 'bold' }}>Realizar pedido</Text>
            </TouchableOpacity>

            <Modal
                visible={modalPedido}
                animationType="slide"
                onRequestClose={() => setModalPedido(false)}
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContenido}>
                        {steps === 0 ? (
                            <View>
                                <TouchableOpacity style={globalStyles.botonCerrar} onPress={() => setModalPedido(false)}>
                                    <View >
                                        <Ionicons name="close" size={24} color="black" />
                                    </View>
                                </TouchableOpacity>
                                <View>
                                    <Text style={globalStyles.title}>Pedido</Text>
                                    {clienteSeleccionado && (
                                        <View>
                                            <Text style={styles.label}>Cliente</Text>
                                            <Text style={[styles.label, { fontSize: 16 }, globalStyles.naranja]}>{`${clienteSeleccionado.user_nom} ${clienteSeleccionado.user_apels}`}</Text>
                                        </View>
                                    )}
                                    <View>
                                        <Text style={styles.label}>Metodo de pago</Text>
                                        <Picker
                                            style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
                                            selectedValue={metodoPago}
                                            onValueChange={(itemValue, itemIndex) => setMetodoPago(itemValue)}
                                        >
                                            <Picker.Item label="Efectivo" value="Efectivo" />
                                            <Picker.Item label="Tarjeta" value="Tarjeta" />
                                            <Picker.Item label="Nequi" value="Nequi" />
                                            <Picker.Item label="Daviplata" value="Daviplata" />
                                        </Picker>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.label}>Total a pagar</Text>
                                        <Text style={[styles.label, { fontSize: 20 }, globalStyles.naranja]}>{formatNumber(venta.reduce((total, producto) => total + (producto.pro_precio * producto.cantidad), 0))}</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.label}>Cantidad a recibir</Text>
                                        <TextInput
                                            value={cantidadRecibida}
                                            onChangeText={(text) => setCantidadRecibida(text)}
                                            style={styles.input}
                                            placeholder="Cantidad a recibir"
                                            placeholderTextColor="#ccc"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <TouchableOpacity style={styles.buttonAdd} onPress={() => handleSubmit()}>
                                        <Text style={{ color: '#ccc', fontWeight: 'bold' }}>Realizar pedido</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonAdd} onPress={() => setModalPedido(false)}>
                                        <Text style={{ color: '#ccc', fontWeight: 'bold' }}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View>
                                <TouchableOpacity style={globalStyles.botonCerrar} onPress={() => setModalPedido(false)}>
                                    <View >
                                        <Ionicons name="close" size={24} color="black" />
                                    </View>
                                </TouchableOpacity>
                                <Text style={[styles.modalTitulo, { textAlign: 'center', color: '#198754' }]}>Pedido realizado <Ionicons name="checkmark-circle" size={24} color="#198754" /></Text>
                                <Text style={[styles.label, { fontSize: 20, textAlign: 'center' }]}>Detalles del pedido</Text>
                                <ScrollView horizontal={true} style={{ maxHeight: 230, marginVertical: 40 }} contentContainerStyle={{ flexGrow: 1 }}>
                                    <ScrollView style={{ height: '100%' }}>
                                        <View style={styles.headerTable}>
                                            <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Producto</Text></View>
                                            <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Puntos</Text></View>
                                            <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Subtotal</Text></View>
                                        </View>
                                        {ventaPrevia.length === 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay productos en el pedido</Text>}
                                        {ventaPrevia.map((producto) => (
                                            <View style={styles.row} key={producto.id_producto}>
                                                <View style={[styles.cell]}>
                                                    <Text style={[styles.cellText, { fontSize: 14, color: '#fff', alignSelf: 'center' }]}>{producto.pro_nom}</Text>
                                                </View>
                                                <View style={[styles.cell]}>
                                                    <Text style={[styles.cellText, { fontSize: 14, color: '#fff', alignSelf: 'center' }]}>{producto.pro_puntos * producto.cantidad}</Text>
                                                </View>
                                                <View style={[styles.cell]}>
                                                    <Text style={[styles.cellText, { fontSize: 14, color: '#fff', alignSelf: 'center' }]}>{formatNumber(producto.pro_precio * producto.cantidad)}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                    <TouchableOpacity style={styles.buttonAdd} onPress={() => setModalPedido(false)}>
                                        <Text style={{ color: '#ccc', fontWeight: 'bold' }}>Cerrar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                        }

                    </View>
                </View>
            </Modal>
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
        width: '100%'
    },
    modalContent: {
        width: '100%',
        height: '100%',
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
        justifyContent: 'space-between',
        alignContent: 'center',
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
        width: '100%',
        height: 40,
        padding: 10,
        color: '#fff',
        marginBottom: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#aaaaaa',
    },
    pickerIOS: {
        overflow: 'hidden',
        justifyContent: 'center',
        height: 50,
        width: '100%',
    },
    colorLetterIOS: {
        color: '#fff'
    },
    pickerAndroid: {
        color: '#fff',
        backgroundColor: '#2B3035',
        height: 50,
        justifyContent: 'center',
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitulo: {
        fontFamily: "Homer-Simpson",
        fontSize: 40,
        color: "#FFC107",
    },
    modalImagen: {
        marginTop: 20,
        width: 300,
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalLabel: {
        fontSize: 20,
        color: '#fff',
    },
    modalContenido: {
        width: 330,
        height: 600,
        padding: 20,
        backgroundColor: '#2B3035',
        borderRadius: 15,
    },
    label: {
        color: "#aaaaaa",
        fontSize: 14,
        marginVertical: 5,
    },
})
