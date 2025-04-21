import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, FlatList } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import useMenu from '../../hooks/useMenu';
import { ActivityIndicator, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MenuService from '../../services/MenuServices';
import ImagenesService from '../../services/ImagenesService';
import { showMessage } from 'react-native-flash-message';


export default function MenuAdminScreen() {

    const navigation = useNavigation();

    const { data: categorias, loading, error, refetch } = useMenu("categorias");
    
    const [estadoFiltro, setEstadoFiltro] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    function filtrarCategoriasPorEstado(estado) {
        refetch();
        setEstadoFiltro(Number(estado));
    }

    const categoriasFiltradas = categorias.filter(categoria =>
        estadoFiltro === -1 || categoria.cat_estado === estadoFiltro
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePreviewEditar, setImagePreviewEditar] = useState(null);
    const [categoria, setCategoria] = useState({
        categoria: '',
        foto: null,
    });
    const [categoriaEditar, setCategoriaEditar] = useState({
        id: '',
        categoria: '',
        foto: null,
    })
    const editarModal = (categoria)=>{
        setCategoriaEditar({
            id: categoria.id_categoria,
            categoria: categoria.cat_nom,
            foto: categoria.cat_foto,
        });
        setImagePreviewEditar(categoria.cat_foto);
        setModalEdit(true);
    }

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
    // Función para manejar la selección de una imagen para editar
    const handleSeleccionarImagenEditar = async () => {
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
            setCategoriaEditar({ ...categoriaEditar, foto });
            setImagePreviewEditar(asset.uri);
        }
    }
    const handleChange = (data) => (value) => {
        setCategoria({ ...categoria, [data]: value });
    };
    const handleChangeEditar = (data) => (value) => {
        setCategoriaEditar({ ...categoriaEditar, [data]: value });
    }
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
                formData.append('public_id', `${id_unico}`);

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

    const handleSubmitEditar = async (id) => {
        if (!categoriaEditar.categoria || !categoriaEditar.foto) {
            alert("Por favor, ingresa un nombre y selecciona una imagen.");
            return;
        }
        try {
            setIsLoading(true);
            const categoriaData = {
                categoria: categoriaEditar.categoria,
                foto: ''
            };
            if (categoriaEditar.foto && categoriaEditar.foto.uri) {
                const formData = new FormData();
                formData.append('foto', {
                    uri: categoriaEditar.foto.uri,
                    type: categoriaEditar.foto.type,
                    name: categoriaEditar.foto.name,
                });
                formData.append('upload_preset', 'categorias');
                formData.append('public_id', id);
                console.log(categoriaData);

                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                if (cloudinaryResponse.status == 200) {
                    categoriaData.foto = cloudinaryResponse.data.url;
                }
            } else {
                categoriaData.foto = categoriaEditar.foto;
            }
            const response = await MenuService.actualizarCategoria(id, categoriaData);
            if (response.status == 200) {
                setImagePreviewEditar(null);
                setCategoriaEditar({ id: '', categoria: '', foto: null });
                showMessage({
                    message: "Categoria actualizada con exito",
                    type: "success",
                    duration: 3000,
                    icon: "sucess",
                });
                console.log(categoriaData);
                refetch();
            }
            else {
                showMessage({
                    message: "Error al actualizar la categoria",
                    type: "danger",
                    duration: 3000,
                    icon: "danger",
                })
            }
        }catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const messages = ["Espera...", "Cargando...", "Esto puede tardar un poco...", "Por favor, espera...", "Enviando recompensa..."];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        if (isLoading) {
            showMessage({
                color: "black",
                message: randomMessage,
                icon: props => <ActivityIndicator size="small" color="black" style={{ height: 20, width: 20, marginRight: 10 }} />,
                type: "warning",
            });
        }
    }, [isLoading]);
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

                    {/* Modal para editar */}
                    <Modal
                        visible={modalEdit}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalEdit(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContenido}>
                                <Text style={styles.modalTitulo}>Editar categoria</Text>
                                <Text style={styles.modalLabel}>Imagen</Text>
                                <View style={styles.imageSection}>
                                    <Text style={styles.sectionLabel}>Imagen de la categoría</Text>
                                    <TouchableOpacity
                                        onPress={handleSeleccionarImagenEditar}
                                        style={styles.imageUploadButton}
                                    >
                                        {imagePreviewEditar ? (
                                            <Image
                                                source={{ uri: imagePreviewEditar }}
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
                                    value={categoriaEditar.categoria}
                                    onChangeText={handleChangeEditar('categoria')}
                                />
                                <View style={styles.Botones}>
                                    <TouchableOpacity
                                        style={styles.cancelar}
                                        onPress={() => {
                                            setCategoriaEditar({
                                                id:'',
                                                categoria: '',
                                                foto: null,
                                            });
                                            setImagePreviewEditar(null);
                                            setModalEdit(false);
                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.guardar}
                                        onPress={() => {
                                            handleSubmitEditar(categoriaEditar?.id);
                                            setModalEdit(false);

                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <Picker style={styles.picker}
                        selectedValue={estadoFiltro} onValueChange={(itemValue) => filtrarCategoriasPorEstado(itemValue)}>
                        <Picker.Item label="Activos" value={'1'} />
                        <Picker.Item label="Inactivos" value={'0'} />
                        <Picker.Item label="Todos" value={'-1'} />
                    </Picker>
                </View>

                {/*Contenido */}
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
                                <TouchableOpacity onPress={() => editarModal(categoria)} style={globalStyles.cardEdit}>
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
        margin: 10,
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
