import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import useMenu from '../../hooks/useMenu';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
export default function MenuAdminScreen() {
    const navigation = useNavigation();
    const { data: categorias, loading, error } = useMenu("categorias")
    const [estadoFiltro, setEstadoFiltro] = useState(-1);

    function filtrarCategoriasPorEstado(estado) {
        setEstadoFiltro(Number(estado));
    }

    const categoriasFiltradas = categorias.filter(categoria =>
        estadoFiltro === -1 || categoria.cat_estado === estadoFiltro
    );

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
                                <View style={styles.Botones}>
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
                        <Picker.Item label="Todos" value={-1} />
                        <Picker.Item label="Activos" value={1} />
                        <Picker.Item label="Inactivos" value={0} />
                    </Picker>
                </View>

                <View style={styles.type}>
                    {categoriasFiltradas.map((categoria) => (
                        <Card key={categoria.id_categoria} style={styles.card}>
                            <TouchableOpacity onPress={() => navigation.navigate('Categoria', { id_categoria: categoria.id_categoria, cat_nom: categoria.cat_nom })}>
                                <Image source={{ uri: categoria.cat_foto }} style={styles.img} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardText}>{categoria.cat_nom}</Text>
                                </View>
                                <View style={styles.Botones}>
                                    <TouchableOpacity>
                                        <Ionicons name="add-circle-outline" size={30} color="white" ></Ionicons>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons></Ionicons>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Card>
                    ))}
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
        height: 50,
        width: 150,


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
        marginTop: 10,
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
    textoModal: {
        fontSize: 16,
        marginBottom: 20,
    },
    Botones: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'flex-end',
    },
    cancelar: {
        width: 100,
        height: 50,
        backgroundColor: '#DC3545',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    guardar: {
        width: 100,
        height: 50,
        backgroundColor: '#198754',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    botonTexto: {
        color: '#fff',
        fontSize: 17
    },
    type: {
        padding: 20,
        display: 'flex',
        flexWrap: 'wrap',
        gap:2,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    card: {
        display: 'flex',
        alignSelf: 'center',
        height: 250,
        width: 160,
        marginVertical: 10,
        backgroundColor: '#2B3035',
        shadowColor: '#fff',
        padding: 0,
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
    },
    img: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    cardText: {
        fontSize: 15,
        color: '#ccc',
        marginVertical: 5,
        fontWeight: 'bold',
    },
})
