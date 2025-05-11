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
import { showMessage } from 'react-native-flash-message';

export default function ProveedoresScreen() {
    const route = useRoute();
    const [modalAgregar, setModalAgregar] = useState(false);
    const [modalMostrar, setModalMostrar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { id_proveedor } = route.params || {};
    const { data: proveedores, refetch } = useProveedores("proveedores", { id_proveedor });
    const [proveedorSelected, setProveedorSelected] = useState({
        id_proveedor: "",
        prov_nombre: "",
        prov_contacto_nombre: "",
        prov_contacto_telefono: "",
        prov_direccion: "",
        prov_contacto_email: "",
    });
    const openModal = (proveedor) => {
        setModalMostrar(true);
        setProveedorSelected(proveedor);
    }
    const closeModal = () => {
        setModalMostrar(false);
        setProveedorSelected({
            id_proveedor: "",
            prov_nombre: "",
            prov_contacto_nombre: "",
            prov_contacto_telefono: "",
            prov_direccion: "",
            prov_contacto_email: "",
        });
    }

    //Crear proveedor//
    const [proveedor, setProveedor] = useState({
        prov_nombre: "",
        prov_contacto_nombre: "",
        prov_contacto_telefono: "",
        prov_direccion: "",
        prov_contacto_email: "",
    });
    const handleChange = (data) => (value) => {
        setProveedor({ ...proveedor, [data]: value });
    };
    const handleSubmit = async () => {
        if (!proveedor.prov_nombre || !proveedor.prov_contacto_nombre || !proveedor.prov_contacto_telefono || !proveedor.prov_direccion || !proveedor.prov_contacto_email) {
            const msg = "Todos los campos son obligatorios";
            showMessage({
                message: msg,
                type: 'warning',
            })
            return;
        }
        try {
            const proveedorData = {
                prov_nombre: proveedor.prov_nombre,
                prov_contacto_nombre: proveedor.prov_contacto_nombre,
                prov_contacto_telefono: proveedor.prov_contacto_telefono,
                prov_direccion: proveedor.prov_direccion,
                prov_contacto_email: proveedor.prov_contacto_email,
            };


            const response = await ProveedoresService.crearProveedor(proveedorData);
            if (response.status == 200) {
                showMessage({
                    message: 'Proveedor agregado con éxito',
                    type: 'success',
                    duration: 2000,
                    icon: 'success',
                })
                setProveedor({
                    prov_nombre: "",
                    prov_contacto_nombre: "",
                    prov_contacto_telefono: "",
                    prov_direccion: "",
                    prov_contacto_email: "",
                });
                refetch();
            }
        } catch (error) {
            console.log(error);
            showMessage({
                message: 'Error al agregar el proveedor',
                type: 'danger',
                duration: 2000,
                icon: 'danger',
            })
        } finally {
            setModalAgregar(false);
            setIsLoading(false);
        }

    }
    //Editar Proveedor
    const [modalEditar, setModalEditar] = useState(false);
    const [proveedorEditar, setProveedorEditar] = useState({
        id_proveedor: "",
        prov_nombre: "",
        prov_contacto_nombre: "",
        prov_contacto_telefono: "",
        prov_direccion: "",
        prov_contacto_email: "",
    })
    const editarProveedor = (proveedor) => {
        setProveedorEditar({
            id_proveedor: proveedor.id_proveedor,
            prov_nombre: proveedor.prov_nombre,
            prov_contacto_nombre: proveedor.prov_contacto_nombre,
            prov_contacto_telefono: proveedor.prov_contacto_telefono,
            prov_direccion: proveedor.prov_direccion,
            prov_contacto_email: proveedor.prov_contacto_email,
        });
        setModalEditar(true);
    }
    const handleChangeEditar = (data) => (value) => {
        setProveedorEditar({ ...proveedorEditar, [data]: value });
    }
    const handleSubmitEditar = async (id) => {
        if (!proveedorEditar.prov_nombre || !proveedorEditar.prov_contacto_nombre || !proveedorEditar.prov_contacto_telefono || !proveedorEditar.prov_direccion || !proveedorEditar.prov_contacto_email) {
            const msg = "Todos los campos son obligatorios";
            Alert.alert(msg);
            return;
        }
        try {
            const response = await ProveedoresService.actualizarProveedor(id, proveedorEditar);
            if (response.status == 200) {
                showMessage({
                    message: 'Proveedor editado con éxito',
                    type: 'success',
                    duration: 2000,
                    icon: 'success',
                })
                setProveedorEditar({
                    id_proveedor: "",
                    prov_nombre: "",
                    prov_contacto_nombre: "",
                    prov_contacto_telefono: "",
                    prov_direccion: "",
                    prov_contacto_email: "",
                });
                refetch();
            }
        } catch (error) {
            console.log(error);
            showMessage({
                message: 'Error al editar el proveedor',
                type: 'danger',
                duration: 2000,
                icon: 'danger',
            })
        } finally {
            setModalEditar(false);
            if (id_proveedor) {
                setModalMostrar(false);
            }
        }
    }

    //Eliminar Proveedor
    const EliminarProveedor = async (id) => {
        try {

            Alert.alert(
                "Eliminar proveedor",
                "¿Deseas eliminar este proveedor?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        onPress: async () => {
                            try {
                                setIsLoading(true);
                                const response = await ProveedoresService.eliminarProveedor(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Proveedor eliminado con éxito',
                                        type: 'success',
                                        duration: 2000,
                                        icon: 'success',
                                    })
                                    refetch();
                                }
                            } catch (error) {
                                console.log('Error: ', error);
                                showMessage({
                                    message: 'Error al eliminar al proveedor',
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
            console.log('Error: ', error);
        } finally {
            setIsLoading(false);
            refetch();
        }

    }



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
                    <Modal
                        visible={modalAgregar}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalAgregar(false);
                        }}
                    >
                        <View style={styles.modalContener}>
                            <View style={styles.modalCont}>
                                <Text style={styles.modalTitulo}>Añadir proveedor</Text>

                                <Text style={styles.modalLabel} >Nombre</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el nombre de la empresa"
                                    placeholderTextColor="#aaa"
                                    value={proveedor.prov_nombre}
                                    onChangeText={handleChange('prov_nombre')}
                                />
                                <Text style={styles.modalLabel} >Contacto</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el nombre del contacto"
                                    placeholderTextColor="#aaa"
                                    value={proveedor.prov_contacto_nombre}
                                    onChangeText={handleChange('prov_contacto_nombre')}
                                />
                                <Text style={styles.modalLabel} >Telefono de contacto</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el precio del producto"
                                    placeholderTextColor="#aaa"
                                    value={proveedor.prov_contacto_telefono}
                                    onChangeText={handleChange('prov_contacto_telefono')}
                                />
                                <Text style={styles.modalLabel} >Correo</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el correo del contacto"
                                    placeholderTextColor="#aaa"
                                    value={proveedor.prov_contacto_email}
                                    onChangeText={handleChange('prov_contacto_email')}
                                />
                                <Text style={styles.modalLabel} >Direccion</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese la direccion de la empresa"
                                    placeholderTextColor="#aaa"
                                    value={proveedor.prov_direccion}
                                    onChangeText={handleChange('prov_direccion')}
                                />
                                <View style={styles.Botones}>
                                    <TouchableOpacity
                                        style={styles.cancelar}
                                        onPress={() => {
                                            setModalAgregar(false);
                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.guardar}
                                        onPress={() => {
                                            handleSubmit();
                                            setModalAgregar(false);

                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={modalEditar}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalEditar(false);
                        }}
                    >
                        <View style={styles.modalContener}>
                            <View style={styles.modalCont}>
                                <Text style={styles.modalTitulo}>Editar proveedor</Text>

                                <Text style={styles.modalLabel} >Nombre</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el nombre de la empresa"
                                    placeholderTextColor="#aaa"
                                    value={proveedorEditar.prov_nombre}
                                    onChangeText={handleChangeEditar('prov_nombre')}
                                />
                                <Text style={styles.modalLabel} >Contacto</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el nombre del contacto"
                                    placeholderTextColor="#aaa"
                                    value={proveedorEditar.prov_contacto_nombre}
                                    onChangeText={handleChangeEditar('prov_contacto_nombre')}
                                />
                                <Text style={styles.modalLabel} >Telefono de contacto</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el precio del producto"
                                    placeholderTextColor="#aaa"
                                    value={proveedorEditar.prov_contacto_telefono}
                                    onChangeText={handleChangeEditar('prov_contacto_telefono')}
                                />
                                <Text style={styles.modalLabel} >Correo</Text>
                                <TextInput

                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el correo del contacto"
                                    placeholderTextColor="#aaa"
                                    value={proveedorEditar.prov_contacto_email}
                                    onChangeText={handleChangeEditar('prov_contacto_email')}
                                />
                                <Text style={styles.modalLabel} >Direccion</Text>
                                <TextInput

                                    style={[styles.modalInput]}
                                    placeholder="Ingrese la direccion de la empresa"
                                    placeholderTextColor="#aaa"
                                    value={proveedorEditar.prov_direccion}
                                    onChangeText={handleChangeEditar('prov_direccion')}
                                />
                                <View style={styles.Botones}>
                                    <TouchableOpacity
                                        style={styles.cancelar}
                                        onPress={() => {
                                            setModalEditar(false);
                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.guardar}
                                        onPress={() => {
                                            handleSubmitEditar((proveedorEditar.id_proveedor));
                                            setModalEditar(false);

                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>
                </View>

                <View style={styles.container}>
                    {proveedores ? (
                        proveedores.map((proveedor) => (
                            <View key={proveedor.id_proveedor} style={styles.prov} >
                                <TouchableOpacity onPress={() => openModal(proveedor)}>
                                    <View>
                                        <Text style={styles.text}>{proveedor.prov_nombre}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => editarProveedor(proveedor)} style={globalStyles.cardEdit}  >
                                        <Ionicons name="create-outline" size={20} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={globalStyles.cardDelete}
                                        onPress={() => EliminarProveedor(proveedor.id_proveedor)}>
                                        <Ionicons name="trash-outline" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>

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
                    visible={modalMostrar}
                    onRequestClose={() => {
                        setModalMostrar(false);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContenido}>

                            <TouchableOpacity style={globalStyles.botonCerrar} onPress={closeModal}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Detalles del proveedor</Text>
                            {proveedorSelected ? (

                                <View >
                                    <Text style={styles.modalText}>ID:{proveedorSelected.id_proveedor} </Text>
                                    <Text style={styles.modalText}>Empresa:{proveedorSelected.prov_nombre} </Text>
                                    <Text style={styles.modalText}>Contacto:{proveedorSelected.prov_contacto_nombre} </Text>
                                    <Text style={styles.modalText}>Telefono:{proveedorSelected.prov_contacto_telefono} </Text>
                                    <Text style={styles.modalText}>Direccion:{proveedorSelected.prov_direccion} </Text>
                                    <Text style={styles.modalText}>Email:{proveedorSelected.prov_contacto_email} </Text>
                                </View>


                            ) : (
                                <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>Cargando proveedores...</Text>
                            )}

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
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',

    },
    row: {
        justifyContent: 'center',
        width: 100,
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
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
    modalContener: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Estilos para el contenido del modal
    modalCont: {
        width: 330,
        height: '70%',
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

})
