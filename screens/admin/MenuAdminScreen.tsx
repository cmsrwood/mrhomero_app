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
    const [estadoFiltro, setEstadoFiltro] = useState(1);


    function filtrarCategoriasPorEstado(estado) {
        refetch();
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
                    {/* Modal para agregar */}
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
                        selectedValue={estadoFiltro} onValueChange={(itemValue)=>filtrarCategoriasPorEstado(itemValue)}>
                        <Picker.Item label="Activos" value={'1'} />
                        <Picker.Item label="Inactivos" value={'0'} />
                        <Picker.Item label="Todos" value={'-1'} />
                    </Picker>
                </View>

                <View style={globalStyles.row}>
                    {categoriasFiltradas.map((categoria) => (
                        <Card key={categoria.id_categoria} style={globalStyles.card}>
                            <TouchableOpacity onPress={() => navigation.navigate('Categoria', { id_categoria: categoria.id_categoria, cat_nom: categoria.cat_nom })}>
                                <Image source={{ uri: categoria.cat_foto }} style={globalStyles.img} />
                            </TouchableOpacity>

                            <View style={globalStyles.cardContent}>
                                <Text style={globalStyles.cardText}>{categoria.cat_nom}</Text>
                            </View>
                            <View style={globalStyles.cardActions}>
                                <TouchableOpacity style={globalStyles.cardEdit}>
                                    <Ionicons name="create-outline" size={20} color="black" ></Ionicons>
                                </TouchableOpacity>
                                <TouchableOpacity style={globalStyles.cardDelete}>
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
    // Estilos para los botones superiores
    up: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    // Estilos para el boton de agregar
    add: {
        width: 170,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#157347',
    },
    //Estilos para el select de estado
    picker: {
        color: '#fff',
        backgroundColor: '#565E64',
        height: 50,
        width: 170,
        fontSize: 16,
        borderRadius: 10,
    },
    //Estilos para el modal de agregar 
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
        height: 600,
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
        fontSize: 20,
        color: '#fff',
    },
    //Estilos para la sección de la imagen
    imageSection: {
        marginBottom: 20,
    },
    // Estilos para el label que acompaña la imagen
    sectionLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 8,
    },
    //Estilos para el input de la imagen
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
    //Estilos para la imagen previa
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    //Estilos para el placeholder de la imagen (se usa en caso de que no se haya seleccionado ninguna imagen)
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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
        margin: 10
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
        justifyContent: 'center'
    },
    //Estilos para el boton de guardar
    guardar: {
        width: 100,
        height: 50,
        backgroundColor: '#198754',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    //Estilos para el texto de los botones
    botonTexto: {
        color: '#fff',
        fontSize: 16
    },

    
})
