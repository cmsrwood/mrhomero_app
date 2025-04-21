import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import globalStyles from '../../styles/globalStyles'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons';
import useVentas from '../../hooks/useVentas'
import useClientes from '../../hooks/useClientes';
import VentaService from '../../services/VentasService';
import MenuService from '../../services/MenuServices';


export default function VentasScreen() {


    const { data: ventas } = useVentas("ventas");
    const { data: clientes } = useClientes("clientes");

    const [detalleVentas, setDetalleVentas] = useState([]);

    const [ventaExpanded, setVentaExpanded] = useState([]);

    const handleDetalleVenta = async (id_venta) => {
        if (detalleVentas[id_venta]) {
            toggleVentaExpanded(id_venta);
            return;
        }

        try {
            const detalleVenta = await VentaService.getDetalleVenta(id_venta);
            const detallesConProducto = await Promise.all(detalleVenta.map(async (item) => {
                const producto = await MenuService.getProducto(item.id_producto);
                return { ...item, producto: producto };
            }));

            setDetalleVentas(prev => ({
                ...prev,
                [id_venta]: detallesConProducto
            }));
            toggleVentaExpanded(id_venta);
        } catch (error) {
            console.error("Error al obtener detalle de venta:", error);
        }
    };

    const toggleVentaExpanded = (id_venta) => {
        setVentaExpanded(prev => ({
            ...prev,
            [id_venta]: !prev[id_venta]
        }));
    }



    const formatNumber = (value) => {
        const formattedValue = value.toString().replace(/\D/g, '');
        return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <AdminLayout>
            <View style={styles.container}>
                <Text style={[globalStyles.title, { maxWidth: 250, fontSize: 50 }]}>Gestion de ventas</Text>
                {ventas.map((venta) => (
                    <View key={venta.id_venta}>
                        <TouchableOpacity onPress={() => { handleDetalleVenta(venta.id_venta); toggleVentaExpanded(venta) }} style={styles.card}>
                            <View>
                                <Text style={{ color: '#BDC3C7', marginBottom: 5 }}>{venta.venta_fecha}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 14, alignItems: 'center', marginBottom: 5 }}>
                                    <View style={{ backgroundColor: '#4CD964', borderRadius: 10, height: 20, width: 20, alignItems: 'center', justifyContent: 'center', marginRight: 5, }}>
                                        <Ionicons name="cash" size={15} color="#fff"></Ionicons>
                                    </View>
                                    <Text style={{ color: '#fff', fontSize: 14 }}>{venta.venta_metodo_pago}</Text>
                                </View>

                                <Text style={[{ fontSize: 12, color: clientes.find(cliente => cliente.id_user === venta.id_user) ? '#FFC107' : '#BDC3C7' }]}>{clientes.find(cliente => cliente.id_user === venta.id_user) ? `${clientes.find(cliente => cliente.id_user === venta.id_user).user_nom} ${clientes.find(cliente => cliente.id_user === venta.id_user).user_apels}` : "Cliente no registrado"}</Text>
                            </View>
                            <View style={styles.cardPrice}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>${formatNumber(venta.venta_total)}</Text>
                                <Text style={{ color: '#4CD964', fontSize: 12, fontWeight: 'bold' }}>realizada</Text>
                                <View style={styles.button}>
                                    <TouchableOpacity style={{ backgroundColor: '#FF3B30', borderRadius: 10, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons name="trash" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {ventaExpanded[venta.id_venta] && detalleVentas[venta.id_venta] && (
                            <View id={venta.id_venta} style={styles.table}>
                                <View style={styles.column}>
                                    <View style={styles.headerTable}>
                                        <Text style={{ color: '#fff', marginBottom: 5, }}>C</Text>
                                        <Text style={{ color: '#fff', marginBottom: 5, }}>Producto</Text>
                                        <Text style={{ color: '#fff', marginBottom: 5, }}>Precio</Text>
                                        <Text style={{ color: '#fff', marginBottom: 5, }}>Puntos</Text>
                                        <Text style={{ color: '#fff', marginBottom: 5, }}>Subtotal</Text>
                                    </View>
                                    {detalleVentas[venta.id_venta].map((fila, index) => (
                                        <View key={index} style={styles.row}>
                                            <View style={styles.cell}><Text style={styles.cellText}>{fila.cantidad_producto}</Text></View>
                                            <View style={styles.cell}><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.cellText, { maxWidth: 80 }]}>{fila.producto.pro_nom}</Text></View>
                                            <View style={styles.cell}><Text style={styles.cellText}>${formatNumber(fila.producto.pro_precio)}</Text></View>
                                            <View style={styles.cell}><Text style={styles.cellText}>{fila.producto.pro_puntos}</Text></View>
                                            <View style={styles.cell}><Text style={styles.cellText}>${formatNumber(fila.subtotal)}</Text></View>
                                        </View>

                                    ))}
                                    <View style={styles.bottomTable}>
                                        <Text style={{ color: '#fff', marginBottom: 5, fontWeight: 'bold', marginRight: 113 }}>Total: </Text>
                                        <Text style={{ color: '#FFC107', marginBottom: 5, fontWeight: 'bold' }}>{formatNumber(detalleVentas[venta.id_venta].reduce((total, detalle) => total + detalle.producto.pro_puntos * detalle.cantidad_producto, 0))}</Text>
                                        <Text style={{ color: '#FFC107', marginBottom: 5, fontWeight: 'bold' }}>${formatNumber(venta.venta_total)}</Text>

                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </AdminLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    table: {
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#3A4149',
        borderEndEndRadius: 10,
        borderEndStartRadius: 10,
        padding: 8,
        top: -25,
        paddingTop: 18,
    },
    card: {
        backgroundColor: '#3A4149',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: 8,
        marginBottom: 15
    },
    cardPrice: {
        alignItems: 'center',
        paddingHorizontal: 10
    },
    button: {
        flexDirection: 'row',
        marginTop: 8
    },
    column: {
        borderWidth: 1,
        borderColor: '#BDC3C7',
        borderRadius: 4,
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#BDC3C7',
        marginTop: 10,
        paddingBottom: 10,
    },

    headerTable: {
        flexDirection: 'row',
        gap: '7%',
        borderBottomWidth: 1,
        borderColor: '#BDC3C7',
        paddingTop: 5,
        paddingHorizontal: 10,
        backgroundColor: '#1E1E1E',
        alignContent: 'center',
        justifyContent: 'center'
    },
    bottomTable: {
        flexDirection: 'row',
        gap: '14%',
        borderBottomWidth: 1,
        borderColor: '#BDC3C7',
        paddingTop: 5,
        paddingHorizontal: 10,
        backgroundColor: '#1E1E1E'
    },
    cell: {
        flex: 1,
        marginLeft: -25,
        alignItems: 'center',
        justifyContent: 'center'

    },
    cellText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center'
    }

})
