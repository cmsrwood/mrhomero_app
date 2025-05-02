import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Platform } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment';
import DatePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Picker } from '@react-native-picker/picker';
import useInventario from '../../hooks/useInventario';
import useProveedores from '../../hooks/useProveedores'

export default function PedidosScreen() {
    const { data: inventario, loading, error, refetch } = useInventario('inventario');
    const { data: proveedores } = useProveedores('proveedores');

    const [modalIngreidente, setModalIngreidente] = useState(false)

    const [selectedDate, setSelectedDate] = useState(null);
    const [tempDate, setTempDate] = useState(dayjs());
    const [open, setOpen] = useState(false);

    const openCalendar = () => {
        setTempDate(selectedDate || dayjs());
        setOpen(true);
    }

    const [ingrediente, setIngrediente] = useState({
        inv_nombre: '',
        categoria_inv_nom: 'x',
        inv_fecha_ing: '',
        inv_fecha_cad: '',
        inv_cantidad: '',
        inv_cantidad_min: '',
        id_proveedor: 'x',
    })

    return (
        <AdminLayout>
            <View style={styles.container}>
                <Text style={globalStyles.title}>inventario</Text>
                <View style={styles.containerInfo}>
                    <Text style={{ color: '#fff' }}>Ingredientes totales: {inventario.length}</Text>
                    <TouchableOpacity style={{ backgroundColor: '#198754', padding: 15, borderRadius: 5 }} onPress={() => setModalIngreidente(true)}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Añadir</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ width: "100%" }}>
                    <ScrollView style={{ width: "100%" }} horizontal={true}>
                        <View style={styles.table}>
                            <View style={styles.column}>
                                <View style={styles.headerTable}>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>ID</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Nombre</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Categoria</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Fecha de ingreso</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Fecha de caducidad</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Cantidad</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Cantidad mínima</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Proveedor</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Estado</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14 }]}>Acciones</Text></View>
                                </View>
                                {inventario.map((inventario) => (
                                    <View style={styles.row} key={inventario.id_producto_inv}>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.id_producto_inv}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_nombre}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.categoria_inv_nom}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_fecha_ing}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_fecha_cad}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_cantidad}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_cantidad_min}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{proveedores.find(prov => prov.id_proveedor === inventario.id_proveedor)?.prov_nombre}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: inventario.inv_cantidad < inventario.inv_cantidad_min ? 'red' : 'green' },]}>{inventario.inv_cantidad < inventario.inv_cantidad_min ? 'Agotado' : 'Suficiente'}</Text></View>
                                        <View style={[styles.cell, { flexDirection: "row", gap: 20 }]}>
                                            <TouchableOpacity>
                                                <Ionicons name="pencil" size={24} color="#FFC107" />
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Ionicons name="trash" size={24} color="red" />
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                ))}

                            </View>
                        </View>
                    </ScrollView>
                </ScrollView>
                { /*Modal para Agregar ingrediente*/}

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalIngreidente}
                    onRequestClose={() => {
                        setModalIngreidente(false);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={[globalStyles.title, { fontSize: 40 }]}>Agregar ingrediente</Text>
                            <View>
                                <Text style={styles.inputsTitle}>Nombre</Text>
                                <TextInput
                                    placeholder='Ej: Tomate'
                                    placeholderTextColor={'#fff'}
                                    style={styles.input}
                                />

                                <Text style={styles.inputsTitle}>Categoria</Text>
                                <Picker
                                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                                    mode="dialog"
                                >
                                    <Picker.Item label="Activos" />
                                    <Picker.Item label="Inactivos" />
                                    <Picker.Item label="Todos" />
                                </Picker>

                                <Text style={styles.inputsTitle}>Fecha de ingreso</Text>
                                <TouchableOpacity onPress={openCalendar} style={styles.input}>
                                    <Text style={styles.inputText}>
                                        {selectedDate ? selectedDate.format('DD/MM/YYYY') : 'Selecciona una fecha'}
                                    </Text>
                                </TouchableOpacity>
                                <Modal visible={open} transparent animationType="slide">
                                    <View style={styles.modalContainer}>
                                        <View style={[styles.modalContent, { height: 450 }]}>
                                            <DatePicker
                                                styles={{
                                                    day_cell: { color: '#fff' },
                                                    selected_label: { color: '#ffc107', borderColor: '#ffc107', borderWidth: 1, borderRadius: 10, padding: 10, backgroundColor: '#2B3035' },
                                                    day_label: { color: '#fff' },
                                                    month_selector_label: { color: '#fff' },
                                                    month_label: { color: '#fff' },
                                                    selected_month_label: { color: '#ffc107' },
                                                    year_selector_label: { color: '#fff' },
                                                    year_label: { color: '#fff' },
                                                    active_year_label: { color: '#ffc107' },
                                                    weekday_label: { color: '#ccc' },
                                                }}
                                                mode="single"
                                                date={tempDate}
                                                onChange={(selected) => setTempDate(dayjs(selected.date))}
                                                locale="es"

                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => {
                                                        setSelectedDate(tempDate);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Text style={{ color: '#198754', fontWeight: 'bold' }}>Confirmar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => setOpen(false)}
                                                >
                                                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancelar</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>
                                </Modal>

                                <Text style={styles.inputsTitle}>Fecha de caducidad</Text>
                                <TouchableOpacity onPress={openCalendar} style={styles.input}>
                                    <Text style={styles.inputText}>
                                        {selectedDate ? selectedDate.format('DD/MM/YYYY') : 'Selecciona una fecha'}
                                    </Text>
                                </TouchableOpacity>
                                <Modal visible={open} transparent animationType="slide">
                                    <View style={styles.modalContainer}>
                                        <View style={[styles.modalContent, { height: 450 }]}>
                                            <DatePicker
                                                styles={{
                                                    day_cell: { color: '#fff' },
                                                    selected_label: { color: '#ffc107', borderColor: '#ffc107', borderWidth: 1, borderRadius: 10, padding: 10, backgroundColor: '#2B3035' },
                                                    day_label: { color: '#fff' },
                                                    month_selector_label: { color: '#fff' },
                                                    month_label: { color: '#fff' },
                                                    selected_month_label: { color: '#ffc107' },
                                                    year_selector_label: { color: '#fff' },
                                                    year_label: { color: '#fff' },
                                                    active_year_label: { color: '#ffc107' },
                                                    weekday_label: { color: '#ccc' },
                                                }}
                                                mode="single"
                                                date={tempDate}
                                                onChange={(selected) => setTempDate(dayjs(selected.date))}
                                                locale="es"

                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => {
                                                        setSelectedDate(tempDate);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Text style={{ color: '#198754', fontWeight: 'bold' }}>Confirmar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => setOpen(false)}
                                                >
                                                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancelar</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>
                                </Modal>

                                <Text style={styles.inputsTitle}>Cantidad</Text>
                                <TextInput
                                    placeholderTextColor={'#fff'}
                                    style={styles.input}
                                />

                                <Text style={styles.inputsTitle}>Cantidad minima</Text>
                                <TextInput
                                    placeholderTextColor={'#fff'}
                                    style={styles.input}
                                />

                                <Text style={styles.inputsTitle}>Proveedor</Text>
                                <Picker
                                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                                    mode="dialog"
                                >
                                    <Picker.Item label="Activos" />
                                    <Picker.Item label="Inactivos" />
                                    <Picker.Item label="Todos" />
                                </Picker>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>

                                    <TouchableOpacity
                                        onPress={() => setModalIngreidente(false)}
                                        style={{ backgroundColor: 'red', padding: 15, borderRadius: 5, marginTop: 10 }}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Cancelar</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity style={{ backgroundColor: '#198754', padding: 15, borderRadius: 5, marginTop: 10 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Agregar</Text>
                                    </TouchableOpacity>



                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
        </AdminLayout >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#B7B7B7',
        borderRadius: 8,
    },
    column: {
        flex: 1
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
        paddingVertical: 8,
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
        color: '#BDC3C7',
        fontSize: 12
    },
    containerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 20
    },
    modalContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 330,
        height: 700,
        backgroundColor: '#2B3035',
        borderRadius: 15,
        padding: 20
    },
    input: {

        borderWidth: 1,
        borderColor: "#ccc",
        height: 40,
        width: '100%',
        borderRadius: 15,
        padding: 10,
        color: "#fff",
        margin: 10,
        marginVertical: 10
    },
    inputsTitle: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },
    pickerIOS: {
        overflow: 'hidden',
        justifyContent: 'center',
        height: 50,
        width: '105%',
        marginVertical: 10,

    },
    inputText: {
        color: '#fff',
    },

})
