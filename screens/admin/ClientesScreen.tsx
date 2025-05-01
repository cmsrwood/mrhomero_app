import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import useClientes from '../../hooks/useClientes'
import ClientesService from '../../services/ClientesServices'
import { showMessage } from 'react-native-flash-message'
import { Picker } from '@react-native-picker/picker'

export default function ClientesScreen() {

    const { data: clientes, loading: loadingClientes, error: errorClientes, refetch: refetchClientes } = useClientes("clientes");
    const [busqueda, setBusqueda] = useState('');
    const [clienteEstado, setClienteEstado] = useState(1);

    useEffect(() => {
        refetchClientes();
    }, [busqueda]);

    const handleDelete = async (id_empleado) => {
        try {
            Alert.alert(
                "Eliminar cliente",
                "¿Deseas eliminar este cliente?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        onPress: async () => {
                            try {
                                const response = await ClientesService.eliminarCliente(id_empleado);
                                if (response.status === 200) {
                                    showMessage({
                                        message: 'Cliente eliminado con éxito.',
                                        type: 'success',
                                        duration: 2000,
                                        icon: 'success'
                                    })
                                }
                                refetchClientes();
                            } catch (error) {
                                console.log('Error: ', error);
                                showMessage({
                                    message: 'Error al eliminar al cliente',
                                    type: 'danger',
                                    duration: 2000,
                                    icon: 'danger'
                                })
                                refetchClientes();
                            }
                        }
                    }
                ]
            )
        } catch (error) {
            console.log(error);
        }
    }

    const handleRestore = async (id_empleado) => {
        try {
            Alert.alert(
                "Restaurar cliente",
                "¿Deseas restaurar este cliente?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Restaurar",
                        onPress: async () => {
                            try {
                                const response = await ClientesService.restaurarCliente(id_empleado);
                                if (response.status === 200) {
                                    showMessage({
                                        message: 'Cliente restaurado con éxito.',
                                        type: 'success',
                                        duration: 2000,
                                        icon: 'success'
                                    })
                                }
                                refetchClientes();
                            } catch (error) {
                                console.log('Error: ', error);
                                showMessage({
                                    message: 'Error al restaurar al cliente',
                                    type: 'danger',
                                    duration: 2000,
                                    icon: 'danger'
                                })
                                refetchClientes();
                            }
                        }
                    }
                ]
            )
        } catch (error) {
            console.log(error);
        }
    }

    function setFiltarClientePorEstado(itemValue) {
        setClienteEstado(itemValue);
    }

    const clientesFiltrados = (clientes || [])
        .filter(cliente => Number(cliente.user_estado) === clienteEstado || clienteEstado === -1)
        .filter(usuario => {
            const cliente = clientes.find(c => c.id_user === usuario.id_user);
            const nombres = cliente ? `${cliente.user_nom} ${cliente.user_apels}` : '';
            const correo = cliente ? cliente.user_email : '';

            return (
                nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
                correo.toLowerCase().includes(busqueda.toLowerCase())
            )

        })




    return (
        <AdminLayout>
            <View style={styles.container}>
                <Text style={globalStyles.title}>clientes</Text>
                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
                    <TextInput placeholder='Buscar cliente' placeholderTextColor={'#BDC3C7'} style={styles.input} value={busqueda} onChangeText={setBusqueda}></TextInput>
                    <Picker
                        style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
                        itemStyle={Platform.OS === 'ios' ? styles.colorLetterIOS : styles.pickerAndroid}
                        mode='dialog'
                        selectedValue={clienteEstado}
                        onValueChange={(itemValue) => setFiltarClientePorEstado(Number(itemValue))}
                    >
                        <Picker.Item label='Activo' value={1} />
                        <Picker.Item label='Inactivo' value={'0'} />
                        <Picker.Item label='Todos' value={-1} />
                    </Picker>
                </View>
                <ScrollView style={{ width: '100%' }}>
                    <ScrollView horizontal={true} style={{ width: '100%' }}>
                        <View style={styles.table}>
                            <View style={styles.column}>
                                <View style={styles.headerTable}>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>ID</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>Nombres</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>Apellidos</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>Correo</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>Estado</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>Eliminar</Text></View>
                                </View>
                            </View>
                            {clientesFiltrados.length === 0 ? (
                                <View style={styles.row}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 100 }}>
                                        <Text style={[styles.cellText, { fontWeight: 'bold', fontSize: 20 }]}>No se encontraron clientes con ese estado.</Text>
                                    </View>
                                </View>
                            ) : (clientesFiltrados.map((cliente) => (
                                <View style={styles.row} key={cliente.id_user}>
                                    <View style={styles.cell}><Text style={styles.cellText}>{cliente.id_user}</Text></View>
                                    <View style={styles.cell}><Text style={styles.cellText}>{cliente.user_nom}</Text></View>
                                    <View style={styles.cell}><Text style={styles.cellText}>{cliente.user_apels}</Text></View>
                                    <View style={styles.cell}><Text style={styles.cellText}>{cliente.user_email}</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { color: cliente.user_estado === 1 ? 'green' : 'red' }]}>{cliente.user_estado === 1 ? 'Activo' : 'Inactivo'}</Text></View>
                                    <TouchableOpacity style={styles.cell}
                                        onPress={() => cliente.user_estado === 1 ? handleDelete(cliente.id_user) : handleRestore(cliente.id_user)}
                                    >
                                        <Ionicons name={cliente.user_estado === 1 ? 'trash' : 'reload'} style={[styles.cellText, { fontSize: 30, color: cliente.user_estado === 1 ? 'red' : 'green' }]}></Ionicons>
                                    </TouchableOpacity>
                                </View>
                            )))}

                        </View>
                    </ScrollView>
                </ScrollView>

            </View>
        </AdminLayout >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ffc107',
        height: 50,
        width: Platform.OS === 'ios' ? '58%' : '60%',
        borderRadius: 15,
        padding: 10,
        marginRight: 15,
        color: '#fff'
    },
    buttonEstado: {
        width: 100,
        height: 50,
        backgroundColor: '#FFC107',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#BDC3C7',
        marginTop: 25,
        borderRadius: 8
    },
    headerTable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        backgroundColor: '#2B3035',
        borderWidth: 1,
        borderColor: '#4A5159',
        borderRadius: 8,
        paddingVertical: 10,
    },
    column: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#4A5159',
        paddingVertical: 8

    },
    cell: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 3
    },
    cellText: {
        color: '#fff'
    },
    pickerIOS: {
        overflow: 'hidden',
        justifyContent: 'center',
        height: 50,
        width: 150,
    },
    colorLetterIOS: {
        color: '#fff'

    },
    pickerAndroid: {
        color: '#fff',
        backgroundColor: '#2B3035',
        height: 50,
        justifyContent: 'center',
        width: 120,
    }
})
