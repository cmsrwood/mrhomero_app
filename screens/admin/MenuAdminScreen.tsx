import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, FlatList } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import useMenu from '../../hooks/useMenu';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MenuService from '../../services/MenuServices';
import ImagenesService from '../../services/ImagenesService';
import { showMessage } from 'react-native-flash-message';

export default function MenuAdminScreen() {

    const navigation = useNavigation();

    const { data: categorias, loading, error, refetch } = useMenu("categorias");
    const [estadoFiltro, setEstadoFiltro] = useState(-1);


    function filtrarCategoriasPorEstado(estado) {
        setEstadoFiltro(Number(estado));
    }

    const categoriasFiltradas = categorias.filter(categoria =>
        estadoFiltro === -1 || categoria.cat_estado === estadoFiltro
    );

    const [modalVisible, setModalVisible] = useState(false);

    const [imagePreview, setImagePreview] = useState(null);;
    const [categoria, setCategoria] = useState({
        categoria: '',
        foto: null,
    });

    const handleSeleccionarImagen = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const foto = {
                uri: asset.uri,
                type: 'image/jpeg',
                name: `foto_${Date.now()}.jpg`,
            }
            setCategoria({ ...categoria, foto });
            setImagePreview(asset.uri);
        }
    };

    const handleChange = (data) => (value) => {
        setCategoria({ ...categoria, [data]: value });
    };

    const handleSubmit = async () => {
        if (!categoria.categoria || !categoria.foto) {
            alert("Por favor, ingresa un nombre y selecciona una imagen.");
            return;
        }

        try {
            // 1. Crear la categoría sin imagen
            const id_unico = `categoria_${categoria.categoria.replace(/\s+/g, '_')}_${Date.now()}`;
            const categoriaData = {
                id: id_unico,
                categoria: categoria.categoria,
                foto: '',
            };

            const response = await MenuService.crearCategoria(categoriaData);

            if (response.status === 200) {
                // 2. Subir la imagen a Cloudinary
                const formData = new FormData();
                formData.append('foto', {
                    uri: categoria.foto.uri,
                    type: categoria.foto.type,
                    name: categoria.foto.name,
                });
                formData.append('upload_preset', 'categorias');
                formData.append('public_id', `categoria_${categoria.categoria}_${id_unico}`);

                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                const url = cloudinaryResponse.data.url;

                // 3. Actualizar la categoría con la URL de la imagen
                await MenuService.actualizarCategoria(id_unico, { foto: url });

                // Éxito
                showMessage({ message: "Categoría creada con éxito", type: "success" });
                setCategoria({ categoria: '', foto: null });
                setImagePreview(null);
                refetch();
            }
        } catch (error) {
            console.error(error);
            alert("Error al crear la categoría.");
        }
        setModalVisible(false);
    };

    return (
        <AdminLayout>
            <View style={styles.general}>
                <Text style={globalStyles.title}>Menu</Text>

                <View style={styles.up}>

                    <TouchableOpacity style={styles.add}
                        onPress={
                            () => {
                                setModalVisible(true);
                            }
                        }>
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text style={styles.botonTexto} >Añadir Categoria</Text>
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
                                <Text style={styles.modalLabel}>Imagen</Text>
                                <View style={styles.imageSection}>
                                    <Text style={styles.sectionLabel}>Imagen de la categoría</Text>
                                    <TouchableOpacity
                                        onPress={handleSeleccionarImagen}
                                        style={styles.imageUploadButton}
                                    >
                                        {imagePreview ? (
                                            <Image
                                                source={{ uri: imagePreview }}
                                                style={styles.imagePreview}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={styles.imagePlaceholder}>
                                                <Ionicons name="image-outline" size={40} color="#aaa" />
                                                <Text style={styles.placeholderText}>Seleccionar imagen</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalLabel} >Nombre</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el nombre de la categoria"
                                    placeholderTextColor="#aaa"
                                    value={categoria.categoria}
                                    onChangeText={handleChange('categoria')}
                                />
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
                                            handleSubmit();
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
                        <Picker.Item style={styles.itemPicker} label="Todos" value={-1} />
                        <Picker.Item style={styles.itemPicker} label="Activos" value={1} />
                        <Picker.Item style={styles.itemPicker} label="Inactivos" value={0} />
                    </Picker>
                </View>

                <View style={styles.type}>
                    {categoriasFiltradas.map((categoria) => (
                        <Card key={categoria.id_categoria} style={styles.card}>
                            <TouchableOpacity onPress={() => navigation.navigate('Categoria', { id_categoria: categoria.id_categoria, cat_nom: categoria.cat_nom })}>
                                <Image source={{ uri: categoria.cat_foto }} style={styles.img} />
                            </TouchableOpacity>

                            <View style={styles.cardContent}>
                                <Text style={styles.cardText}>{categoria.cat_nom}</Text>
                            </View>
                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.cardEdit}>
                                    <Ionicons name="create-outline" size={20} color="black" ></Ionicons>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cardDelete}>
                                    <Ionicons name="trash-outline" size={20} color="white" ></Ionicons>
                                </TouchableOpacity>
                            </View>
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
        width: 170,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#157347',
        borderRadius: 10,
    },
    picker: {
        color: '#fff',
        backgroundColor: '#565E64',
        height: 50,
        width: 170,
        fontSize: 16,
        borderRadius: 10,
    },
    itemPicker: {
        color: '#fff',
        fontSize: 16,
        width: 100,
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
        fontSize: 16
    },
    type: {
        padding: 20,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    card: {
        display: 'flex',
        alignSelf: 'center',
        height: 260,
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
    cardActions: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center'
    },
    cardEdit: {
        width: 40,
        height: 40,
        backgroundColor: '#FFCA2C',
        borderRadius: 10,
        padding: 10
    },
    cardDelete: {
        width: 40,
        height: 40,
        backgroundColor: '#BB2D3B',
        borderRadius: 10,
        padding: 10
    },
    modalInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        height: 40,
        width: '100%',
        borderRadius: 15,
        padding: 10,
        margin: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f8f9fa',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    imageSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 8,
    },
    imageUploadButton: {
        marginVertical: 15,
        height: 150,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    placeholderText: {
        marginTop: 8,
        color: '#aaa',
        fontSize: 14,
    },
    inputSection: {
        marginBottom: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#f1f1f1',
    },
    saveButton: {
        backgroundColor: '#28a745',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 5,
        color: '#fff',
    },
})
