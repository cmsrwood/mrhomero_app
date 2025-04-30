import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import useEmpleados from '../../hooks/useEmpleados'
import EmpleadosService from '../../services/EmpleadosService'
import { showMessage } from 'react-native-flash-message'
import moment from 'moment';

export default function EmpleadosScreen() {

    const { data: empleados, loading: loadingEmpleados, error: errorEmpleados, refetch: refetchEmpleados } = useEmpleados('Empleados');
    const [isLoading, setIsLoading] = useState(false);
    const [empleadoEditarModal, setEmpleadoEditarModal] = useState(false)
    const [empleadoModal, setEmpleadoModal] = useState(false)



    const [empleado, setEmpleado] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        registro: ""
    })

    const handleSubmit = async () => {
        if (!empleado.nombre || !empleado.apellidos || !empleado.telefono || !empleado.email) {
            alert("Todos los campos son obligatorios.");
            return
        }

        const payload = {
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            telefono: empleado.telefono,
            email: empleado.email,
            registro: moment().format('YYYY-MM-DD HH:mm:ss'), 
        };

        try {
            setEmpleadoModal(false);
            setIsLoading(true);

            const response = await EmpleadosService.crearEmpleado(payload);
            if (response.status == 200) {
                showMessage({
                    message: 'Empleado creado con éxito.',
                    type: 'success',
                    duration: 2000,
                    icon: 'success'
                })
                setEmpleado({
                    nombre: '',
                    apellidos: '',
                    telefono: '',
                    email: '',
                    registro: ""
                })
                setIsLoading(false);
                refetchEmpleados();
            }

        } catch (error) {
            console.error(error);
            showMessage({
                message: 'Error al crear al empleado',
                type: 'danger',
                duration: 2000,
                icon: 'danger'
            })
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (data) => (value) => {
        setEmpleado({ ...empleado, [data]: value });
    }

    const eliminarEmpleado = async (id) => {
        try {
            Alert.alert(
                "Eliminar empleado",
                "¿Deseas eliminar este empleado?",
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
                                const response = await EmpleadosService.eliminarEmpleado(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Empleado eliminado con éxito.',
                                        type: 'success',
                                        duration: 2000,
                                        icon: 'success'
                                    })
                                }
                                setIsLoading(false);
                                refetchEmpleados();
                            } catch (error) {
                                console.log('Error: ', error);
                                showMessage({
                                    message: 'Error al eliminar al empleado',
                                    type: 'danger',
                                    duration: 2000,
                                    icon: 'danger'
                                })
                                refetchEmpleados();
                            }
                        }
                    }
                ]
            )
        } catch (error) {

        }
    }

    const [empleadoEditar, setEmpleadosEditar] = useState({
        id: '',
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        foto: ''
    })

    const editarModal = (empleado) => {
        setEmpleadosEditar({
            id: empleado.id_user,
            nombre: empleado.user_nom,
            apellidos: empleado.user_apels,
            telefono: empleado.user_tel,
            email: empleado.user_email,
            foto: empleado.user_foto
        });
        setEmpleadoEditarModal(true);
    }

    const handleSubmitEdit = async () => {
        if (!empleadoEditar.nombre || !empleadoEditar.apellidos || !empleadoEditar.telefono) {
            alert("Todos los campos son obligatorios.");
            return
        }

        try {
            setEmpleadoEditarModal(false);
            setIsLoading(true);
            const response = await EmpleadosService.editarEmpleado(empleadoEditar);
            if (response.status == 200) {
                showMessage({
                    message: 'Empleado actualizado con éxito.',
                    type: 'success',
                    duration: 2000,
                    icon: 'success'
                })
                refetchEmpleados()
            } else {
                showMessage({
                    message: 'Error al actualizar al empleado',
                    type: 'danger',
                    duration: 2000,
                    icon: 'danger'
                })
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AdminLayout>
            <View style={styles.container}>
                <Text style={[globalStyles.fontHomero, styles.fontHomero]}>Empleados</Text>
                <View style={{ alignSelf: 'flex-end', marginRight: 20, marginTop: 10 }} >
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#28a745', padding: 10, borderRadius: 10 }} onPress={() => setEmpleadoModal(true)}>
                        <Ionicons name='person-add-outline' style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}></Ionicons>
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>Crear empleado</Text>
                    </TouchableOpacity>
                </View>
                {empleados?.length === 0 && !loadingEmpleados && <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold', marginVertical: 100 }}>No hay empleados</Text>}
                {empleados.map((empleado) => (
                    <View style={styles.containerEmpleado} key={empleado.id_user}>
                        <View>
                            <Image source={{ uri: empleado.user_foto }} style={styles.img}></Image>
                        </View>
                        <View style={{ justifyContent: 'space-between' }}>
                            <Text style={styles.nombreEmpleado}>{empleado.user_nom} {empleado.user_apels}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.buttonGestionar}>
                                    <Ionicons name='create-outline' style={{ fontSize: 14, fontWeight: 'bold' }} onPress={() => editarModal(empleado)}> Gestionar</Ionicons>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonEliminar} onPress={() => eliminarEmpleado(empleado.id_user)}>
                                    <Ionicons name='trash-outline' style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}> Eliminar</Ionicons>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
                {/*Modal para agregar empleados */}

                <Modal
                    visible={empleadoModal}
                    animationType='slide'
                    transparent={true}
                    onRequestClose={() => {
                        setEmpleadoModal(false)
                    }}
                >
                    <View style={styles.containerModal}>
                        <View style={styles.contentModalAgregar}>
                            <Text style={[styles.tituloModal, globalStyles.fontHomero]}>Crear Empleado</Text>
                            <View>
                                <Text style={styles.inputsTitle}>Nombres</Text>
                                <TextInput
                                    placeholder='Nombres' style={styles.input}
                                    placeholderTextColor={'#fff'}
                                    value={empleado.nombre}
                                    onChangeText={handleChange('nombre')}
                                />

                                <Text style={styles.inputsTitle}>Apellidos</Text>
                                <TextInput
                                    placeholder='Apellidos'
                                    style={styles.input}
                                    placeholderTextColor={'#fff'}
                                    value={empleado.apellidos}
                                    onChangeText={handleChange('apellidos')}
                                />

                                <Text style={styles.inputsTitle}>Telefono</Text>
                                <TextInput
                                    placeholder='Telefono'
                                    keyboardType='numeric'
                                    style={styles.input}
                                    placeholderTextColor={'#fff'}
                                    value={empleado.telefono}
                                    onChangeText={handleChange('telefono')}

                                />

                                <Text style={styles.inputsTitle}>Correo</Text>
                                <TextInput
                                    placeholder='Correo'
                                    style={styles.input}
                                    placeholderTextColor={'#fff'}
                                    value={empleado.email}
                                    onChangeText={handleChange('email')}
                                />
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 35, marginTop: 8, gap: 8 }}>
                            <TouchableOpacity style={styles.buttonAccept} onPress={() => {
                                handleSubmit();
                                setEmpleadoModal(false);
                            }}>
                                <Text style={{ fontSize: 15, color: '#000' }}>Aceptar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonCancel} onPress={() => {
                                setEmpleadoModal(false);
                            }}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>

                {/*Modal para editar empleados */}
                <Modal
                    visible={empleadoEditarModal}
                    animationType='slide'
                    transparent={true}
                    onRequestClose={() => {
                        setEmpleadoEditarModal(false)
                    }}
                >
                    <View style={styles.containerModal}>
                        <View style={styles.contentModal}>
                            <Text style={[styles.tituloModal, globalStyles.fontHomero]}>Editar Empleado</Text>
                            <View>
                                <Text style={styles.inputsTitle}>Foto</Text>
                                <Image source={{ uri: empleadoEditar.foto }} style={styles.modalImage}></Image>

                                <Text style={styles.inputsTitle}>Nombres</Text>
                                <TextInput
                                    placeholder='Nombre' style={styles.input}
                                    value={empleadoEditar.nombre}
                                    onChangeText={(text) => setEmpleadosEditar({ ...empleadoEditar, nombre: text })}
                                />

                                <Text style={styles.inputsTitle}>Apellidos</Text>
                                <TextInput
                                    placeholder='Apellidos'
                                    style={styles.input}
                                    value={empleadoEditar.apellidos}
                                    onChangeText={(text) => setEmpleadosEditar({ ...empleadoEditar, apellidos: text })}
                                />

                                <Text style={styles.inputsTitle}>Telefono</Text>
                                <TextInput
                                    placeholder='Telefono'
                                    keyboardType='numeric'
                                    style={styles.input}
                                    value={empleadoEditar.telefono}
                                    onChangeText={(text) => setEmpleadosEditar({ ...empleadoEditar, telefono: text })}
                                />

                                <Text style={styles.inputsTitle}>Correo</Text>
                                <TextInput
                                    placeholder='Correo'
                                    style={styles.input}
                                    value={empleadoEditar.email}
                                    editable={false}
                                />
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 35, marginTop: 8, gap: 8 }}>
                            <TouchableOpacity style={styles.buttonAccept} onPress={handleSubmitEdit}>
                                <Text style={{ fontSize: 15, color: '#000' }}>Aceptar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonCancel} onPress={() => {
                                setEmpleadosEditar({
                                    id: '',
                                    nombre: '',
                                    apellidos: '',
                                    telefono: '',
                                    email: '',
                                    foto: ''
                                });
                                setEmpleadoEditarModal(false);
                            }}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>

            </View>
        </AdminLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    containerModal: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentModal: {
        width: 330,
        height: 620,
        backgroundColor: '#2B3035',
        borderRadius: 15,
        padding: 20,
    },
    contentModalAgregar: {
        width: 330,
        height: 450,
        backgroundColor: '#2B3035',
        borderRadius: 15,
        padding: 20,
    },
    tittleModal: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    fontHomero: {
        color: '#FFC107',
        fontSize: 65,
        marginTop: 20
    },
    containerEmpleado: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 25,
        gap: 20,
        borderWidth: 1,
        borderColor: '#4A5159',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#3A4149',
        maxWidth: 350
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 5
    },
    nombreEmpleado: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        maxWidth: 200
    },
    buttonGestionar: {
        backgroundColor: '#FFC107',
        padding: 10,
        borderRadius: 10,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13
    },
    buttonEliminar: {
        backgroundColor: '#BB2D3B',
        padding: 10,
        borderRadius: 10,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tituloModal: {
        fontSize: 40,
        color: '#FFC107',
        marginBottom: 20
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
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    modalImage: {
        width: "70%",
        height: "25%",
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: 10
    },
    buttonAccept: {
        backgroundColor: '#FFC107',
        padding: 10,
        width: 80,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    buttonCancel: {
        backgroundColor: '#BB2D3B',
        padding: 10,
        width: 80,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    }
})