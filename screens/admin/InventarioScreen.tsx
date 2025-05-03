import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Platform } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import DatePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Picker } from '@react-native-picker/picker';
import useInventario from '../../hooks/useInventario';
import useProveedores from '../../hooks/useProveedores'
import InventarioService from '../../services/InventarioService';
import { showMessage } from 'react-native-flash-message'

export default function PedidosScreen() {
    const { data: inventario, loading, error, refetch } = useInventario('inventario');
    const { data: proveedores } = useProveedores('proveedores');

    const [modalIngreidente, setModalIngrediente] = useState(false)
    const [editarID, setEditarID] = useState(null);

    const [selectedDateIngreso, setSelectedDateIngreso] = useState(null);
    const [selectedDateCaducidad, setSelectedDateCaducidad] = useState(null);

    const [tempDateIngreso, setTempDateIngreso] = useState(dayjs());
    const [tempDateCaducidad, setTempDateCaducidad] = useState(dayjs());

    const [openIngreso, setOpenIngreso] = useState(false);
    const [openCaducidad, setOpenCaducidad] = useState(false);

    const [bajoStockInventario, setBajoStockInventario] = useState([]);

    //Funcion para abrir el calendario para la fecha de ingreso
    const openCalendarIngreso = () => {
        setTempDateIngreso(selectedDateIngreso || dayjs());
        setOpenIngreso(true);
    }

    //Funcion para abrir el calendario para la fecha de caducidad
    const openCalendarCaducidad = () => {
        setTempDateCaducidad(selectedDateCaducidad || dayjs());
        setOpenCaducidad(true);
    }

    //Funcion para crear un nuevo producto del inventario

    const [ingrediente, setIngrediente] = useState({
        inv_nombre: '',
        categoria_inv_nom: '',
        inv_fecha_ing: '',
        inv_fecha_cad: '',
        inv_cantidad: '',
        inv_cantidad_min: '',
        id_proveedor: '',
    })

    const handleEditar = (producto) => {

        setEditarID(producto.id_producto_inv);
        setIngrediente({
            ...producto,
            inv_cantidad: producto.inv_cantidad.toString(),
            inv_cantidad_min: producto.inv_cantidad_min.toString(),
        })

        setSelectedDateIngreso(producto.inv_fecha_ing ? dayjs(producto.inv_fecha_ing) : null);
        setSelectedDateCaducidad(producto.inv_fecha_cad ? dayjs(producto.inv_fecha_cad) : null);
        setModalIngrediente(true);
    }

    const resetForm = () => {
        setIngrediente({
            inv_nombre: '',
            categoria_inv_nom: '',
            inv_fecha_ing: '',
            inv_fecha_cad: '',
            inv_cantidad: '',
            inv_cantidad_min: '',
            id_proveedor: '',
        })
        setSelectedDateIngreso(null);
        setSelectedDateCaducidad(null);
        setTempDateIngreso(dayjs());
        setTempDateCaducidad(dayjs());
    }

    const handleChange = (data) => (value) => {
        setIngrediente({ ...ingrediente, [data]: value });
    }



    const handleSubmit = async () => {
        if (!ingrediente.inv_nombre || !ingrediente.categoria_inv_nom || !ingrediente.inv_fecha_ing || !ingrediente.inv_fecha_cad || !ingrediente.inv_cantidad || !ingrediente.inv_cantidad_min || !ingrediente.id_proveedor) {
            showMessage({
                message: 'Todos los campos son obligatorios',
                type: 'warning',
            })
            return;
        }

        try {
            const ingredienteData = {
                inv_nombre: ingrediente.inv_nombre,
                categoria_inv_nom: ingrediente.categoria_inv_nom,
                inv_fecha_ing: ingrediente.inv_fecha_ing,
                inv_fecha_cad: ingrediente.inv_fecha_cad,
                inv_cantidad: ingrediente.inv_cantidad,
                inv_cantidad_min: ingrediente.inv_cantidad_min,
                id_proveedor: ingrediente.id_proveedor,
            }

            let response

            if (editarID) {
                response = await InventarioService.editarProductoInventario(editarID, ingredienteData);
                showMessage({
                    message: 'Producto creado con éxito',
                    type: 'success',
                    duration: 2000,
                    icon: 'success'
                })
            } else {
                response = await InventarioService.crearProductoInventario(ingredienteData);
                showMessage({
                    message: 'Producto editado con éxito',
                    type: 'success',
                    duration: 2000,
                    icon: 'success'
                })
            }
            if (response.status === 200) {
                resetForm();
                setModalIngrediente(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            showMessage({
                message: `Error al ${editarID ? 'actualizar' : 'crear'} el producto`,
                type: 'danger',
                duration: 2000,
                icon: 'danger'
            });
        } finally {
            setModalIngrediente(false);
        }

    }



    //Funcion para eliminar prodcutos
    const eliminarProductoInventario = async (id) => {
        try {
            Alert.alert(
                "Eliminar producto del inventario",
                "¿Deseas eliminar este producto del inventario?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        onPress: async () => {
                            try {
                                const response = await InventarioService.eliminarProductoInventario(id);
                                if (response.status === 200) {
                                    showMessage({
                                        message: 'Producto eliminado con éxito',
                                        type: 'success',
                                        duration: 2000,
                                        icon: 'success'
                                    })
                                    refetch();
                                }
                            } catch (error) {
                                showMessage({
                                    message: 'Error al eliminar el producto',
                                    type: 'danger',
                                    duration: 2000,
                                    icon: 'danger'
                                })
                            }
                        }
                    }
                ]
            )
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (inventario.length > 0) {
            const bajoStock = inventario.filter((ingrediente) => ingrediente.inv_cantidad <= ingrediente.inv_cantidad_min);
            setBajoStockInventario(bajoStock);
        }
    }, [inventario]);

    return (
        <AdminLayout>
            <View style={styles.container}>
                <Text style={globalStyles.title}>inventario</Text>
                <View style={styles.containerInfo}>
                    <Text style={{ color: '#fff' }}>Ingredientes totales: {inventario.length}</Text>
                    <TouchableOpacity style={{ backgroundColor: '#198754', padding: 15, borderRadius: 5 }} onPress={() => {
                        setEditarID(null);
                        resetForm();
                        setModalIngrediente(true)
                    }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Añadir</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {bajoStockInventario.length > 0 && (
                        <View style={styles.bajoStockBanner}>
                            <Text style={styles.bajoStockText}>
                                ⚠️ {bajoStockInventario.length} producto(s) bajo stock
                            </Text>
                        </View>
                    )}
                </View>
                <ScrollView style={{ width: "100%" }}>
                    <ScrollView style={{ width: "100%" }} horizontal={true}>
                        <View style={styles.table}>
                            <View style={styles.column}>
                                <View style={styles.headerTable}>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>ID</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Nombre</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Categoria</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Fecha de ingreso</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Fecha de caducidad</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Cantidad</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Cantidad mínima</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Proveedor</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Estado</Text></View>
                                    <View style={styles.cell}><Text style={[styles.cellText, { fontWeight: "bold", fontSize: 14, color: '#ffc107' }]}>Acciones</Text></View>
                                </View>
                                {inventario.map((inventario) => (
                                    <View style={styles.row} key={inventario.id_producto_inv}>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: "#ffc107" }]}>{inventario.id_producto_inv}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_nombre}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.categoria_inv_nom}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_fecha_ing}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_fecha_cad}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_cantidad}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{inventario.inv_cantidad_min}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14 }]}>{proveedores.find(prov => prov.id_proveedor === inventario.id_proveedor)?.prov_nombre}</Text></View>
                                        <View style={styles.cell}><Text style={[styles.cellText, { fontSize: 14, color: inventario.inv_cantidad < inventario.inv_cantidad_min ? 'red' : 'green' },]}>{inventario.inv_cantidad < inventario.inv_cantidad_min ? 'Stock bajo' : 'Suficiente'}</Text></View>
                                        <View style={[styles.cell, { flexDirection: "row", gap: 20 }]}>
                                            <TouchableOpacity onPress={() => handleEditar(inventario)}>
                                                <Ionicons name="pencil" size={24} color="#FFC107" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => eliminarProductoInventario(inventario.id_producto_inv)}>
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
                        setModalIngrediente(false);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={[globalStyles.title, { fontSize: 40 }]}>{editarID ? 'Editar ingrediente' : 'Agregar ingrediente'}</Text>
                            <View>
                                <Text style={styles.inputsTitle}>Nombre</Text>
                                <TextInput
                                    placeholder='Ej: Tomate'
                                    placeholderTextColor={'#fff'}
                                    style={styles.input}
                                    value={ingrediente.inv_nombre}
                                    onChangeText={handleChange('inv_nombre')}
                                />

                                <Text style={styles.inputsTitle}>Categoria</Text>
                                <Picker
                                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                                    mode="dialog"
                                    selectedValue={ingrediente.categoria_inv_nom}
                                    onValueChange={handleChange('categoria_inv_nom')}
                                >
                                    <Picker.Item label="Selecciona una categoria" value={null} />
                                    <Picker.Item label="Refrigerado" value="refrigerado" />
                                    <Picker.Item label="Perecedero" value="perecedero" />
                                </Picker>

                                <Text style={styles.inputsTitle}>Fecha de ingreso</Text>
                                <TouchableOpacity onPress={openCalendarIngreso} style={styles.input}>
                                    <Text style={styles.inputText}>
                                        {selectedDateIngreso ? selectedDateIngreso.format('DD/MM/YYYY') : 'Selecciona una fecha'}
                                    </Text>
                                </TouchableOpacity>
                                <Modal visible={openIngreso} transparent animationType="slide">
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
                                                date={tempDateIngreso}
                                                locale="es"
                                                onChange={(selected) => {
                                                    setTempDateIngreso(dayjs(selected.date));
                                                }}

                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => {
                                                        setSelectedDateIngreso(tempDateIngreso);
                                                        setIngrediente(prev => ({
                                                            ...prev,
                                                            inv_fecha_ing: tempDateIngreso.format('YYYY-MM-DD'),
                                                        }))
                                                        setOpenIngreso(false);
                                                    }}
                                                >
                                                    <Text style={{ color: '#198754', fontWeight: 'bold' }}>Confirmar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => setOpenIngreso(false)}
                                                >
                                                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancelar</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>
                                </Modal>

                                <Text style={styles.inputsTitle}>Fecha de caducidad</Text>
                                <TouchableOpacity onPress={openCalendarCaducidad} style={styles.input}>
                                    <Text style={styles.inputText}>
                                        {selectedDateCaducidad ? selectedDateCaducidad.format('DD/MM/YYYY') : 'Selecciona una fecha'}
                                    </Text>
                                </TouchableOpacity>
                                <Modal visible={openCaducidad} transparent animationType="slide">
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
                                                date={tempDateCaducidad}
                                                locale="es"
                                                onChange={(selected) => {
                                                    setTempDateCaducidad(dayjs(selected.date));
                                                }}

                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => {
                                                        setSelectedDateCaducidad(tempDateCaducidad);
                                                        setIngrediente(prev => ({
                                                            ...prev,
                                                            inv_fecha_cad: tempDateCaducidad.format('YYYY-MM-DD'),
                                                        }))
                                                        setOpenCaducidad(false);
                                                    }}
                                                >
                                                    <Text style={{ color: '#198754', fontWeight: 'bold' }}>Confirmar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ padding: 15, borderRadius: 5, marginTop: 10 }}
                                                    onPress={() => setOpenCaducidad(false)}
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
                                    keyboardType='numeric'
                                    value={ingrediente.inv_cantidad}
                                    onChangeText={handleChange('inv_cantidad')}
                                />

                                <Text style={styles.inputsTitle}>Cantidad minima</Text>
                                <TextInput
                                    placeholderTextColor={'#fff'}
                                    style={styles.input}
                                    keyboardType='numeric'
                                    value={ingrediente.inv_cantidad_min}
                                    onChangeText={handleChange('inv_cantidad_min')}
                                />

                                <Text style={styles.inputsTitle}>Proveedor</Text>
                                <Picker
                                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                                    mode="dialog"
                                    selectedValue={ingrediente.id_proveedor}
                                    onValueChange={handleChange('id_proveedor')}
                                >
                                    <Picker.Item label="Selecciona un proveedor" value={null}></Picker.Item>
                                    {proveedores.map((proveedor) => (
                                        <Picker.Item key={proveedor.id_proveedor} value={proveedor.id_proveedor} label={proveedor.prov_nombre} />

                                    ))}
                                </Picker>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalIngrediente(false);
                                            resetForm();
                                        }}
                                        style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 10 }}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Cancelar</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        style={{ backgroundColor: '#198754', padding: 10, borderRadius: 5, marginTop: 10 }}
                                        onPress={() => {
                                            handleSubmit();
                                            setModalIngrediente(false);
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>{editarID ? 'Editar' : 'Agregar'}</Text>
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
    bajoStockBanner: {
        backgroundColor: '#FFF3CD',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    bajoStockText: {
        color: '#856404',
        fontWeight: 'bold',
    },

})
