import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';

export default function MenuAdminScreen() {
    const [estadoFiltro, setEstadoFiltro] = useState(1);
    function filtrarCategoriasPorEstado(estado) {
        setEstadoFiltro(estado);
    }
    const [modalVisible, setModalVisible] = useState(false);
      const [isFocused, setIsFocused] = useState('');
    return (
        <AdminLayout>
            <View style={styles.general}>
                <Text style={globalStyles.title}>Menu admin</Text>

                <View style={styles.up}>

                    <TouchableOpacity style={styles.add}
                        onPress={
                            () => {
                                setModalVisible(true);
                            }
                        }>
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text >Productos</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalVisible(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContenido}>
                                <Text style={styles.modalTitulo}>Añadir categoria</Text>
                                <Image source={require('../../assets/favicon.png')} style={styles.modalImagen}></Image>
                                <Text style={styles.modalLabel} >Imagen</Text>
                                <View style={styles.modalBotones}>
                                    <TouchableOpacity
                                        style={styles.cancelar}
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.guardar}
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <Picker style={styles.picker}
                        selectedValue={estadoFiltro} onValueChange={filtrarCategoriasPorEstado}>
                        <Picker.Item label="Todos" value={1} />
                        <Picker.Item label="Activos" value={2} />
                        <Picker.Item label="Inactivos" value={3} />
                    </Picker>
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
        width: 150,
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
        height: 54,
        width: 150,
        height: 50,

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
    modalLabel:{
        marginTop: 10,
        fontSize:20,
        color: '#fff',
    },
    modalContenido: {
        width: 330,
        height: 600,
        padding: 20,
        backgroundColor: '#2B3035',
        borderRadius: 15,

    },
    textoModal: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalBotones:{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'flex-end',
    },
    cancelar:{
        width: 100,
        height: 50,
        backgroundColor: '#DC3545',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    guardar:{
        width:100,
        height: 50,
        backgroundColor: '#198754',
        borderRadius: 15,
        alignItems:'center',
        padding: 10,
        justifyContent:'center'
    },
    botonTexto:{
        color: '#fff',
        fontSize: 17
    }

})
