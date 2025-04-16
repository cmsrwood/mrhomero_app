import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import useMenu from '../../hooks/useMenu';
import useImagenes from '../../hooks/useImagenes';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MenuService from '../../services/MenuServices';
import ImagenesService from '../../services/ImagenesService';


export default function MenuAdminScreen() {
    const navigation = useNavigation();
    
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: categorias, loading, error, refetch } = useMenu("categorias", {}, refreshKey);
    const [imagePreview, setImagePreview] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState(-1);

    const handleSeleccionarImagen = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Se requieren permisos para acceder a la galería.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
            base64: false
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];

            const file = {
                uri: asset.uri,
                type: asset.type ?? 'image/jpeg',
                name: asset.fileName ?? `foto_${Date.now()}.jpg`,
            };

            console.log("Imagen seleccionada:", file);

            setCategoria(prev => ({ ...prev, foto: file }));
            setImagePreview(asset.uri);
        } else {
            console.log("No se seleccionó ninguna imagen");
        }
    };
    function filtrarCategoriasPorEstado(estado) {
        setEstadoFiltro(Number(estado));
    }

    const categoriasFiltradas = categorias.filter(categoria =>
        estadoFiltro === -1 || categoria.cat_estado === estadoFiltro
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [isFocused, setIsFocused] = useState('');
    const [categoria, setCategoria] = useState({
        categoria: '',
        foto: null,
    });
    console.log(categoria)
    const handleChange = (data) => (value) => {
        setCategoria({ ...categoria, [data]: value });
    };

    const handleSubmit = async () => {
        console.log("🧪 Enviando categoría con imagen:", categoria); 

        if (!categoria.categoria || !categoria.foto) {
            alert("Por favor, ingresa un nombre y selecciona una imagen.");
            return;
        }

        let nombre = categoria.categoria;
        let nombreConGuiones = nombre.replace(/\s+/g, '_');
        const id_unico = `categoria_${nombreConGuiones}_${Date.now()}`;

        try {
            const categoriaData = {
                id: id_unico,
                categoria: categoria.categoria,
                foto: ''
            };

            const response = await MenuService.crearCategoria(categoriaData);

            if (response.status === 200) {
                const formData = new FormData();
                formData.append("foto", {
                    uri: categoria.foto,
                    name:  "foto.jpg",
                    type: "image/jpeg",
                } as any);
                formData.append("upload_preset", "categorias");
                formData.append("public_id", `categoria_${categoria.categoria}_${id_unico}`);

            
                try {
                    const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                    const url = cloudinaryResponse.url; 
                    await MenuService.actualizarCategoria(id_unico, { foto: url });

                    
                    setCategoria({ categoria: '', foto: null });
                    setImagePreview('');
                    setRefreshKey(prev => prev + 1);
                } catch (imgError) {
                    console.log(imgError);
                    await MenuService.eliminarCategoria(id_unico);
                    alert("Error al subir la imagen.");
                }
            }
            setModalVisible(false);
        } catch (error) {
            console.log(error);
            alert("Error al crear la categoría.");
        }
    };



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
                                <TouchableOpacity onPress={handleSeleccionarImagen} style={{ marginVertical: 10 }}>
                                    <Text style={styles.modalInput}></Text>
                                    {imagePreview ? (
                                        <Image source={{ uri: imagePreview }} style={{ width: 200, height: 120, alignSelf: 'center' }} />
                                    ) : (
                                        <Text style={{ color: '#aaa', textAlign: 'center' }}>No se ha seleccionado imagen</Text>
                                    )}
                                </TouchableOpacity>


                                <Text style={styles.modalLabel} >Nombre</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Ingrese el nombre de la categoria"
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
        color: "#fff",
        margin: 10
    },
})
