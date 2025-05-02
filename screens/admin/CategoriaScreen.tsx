import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import useMenu from "../../hooks/useMenu";
import { useRoute } from '@react-navigation/native';
import Loader from '../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import ProductosService from '../../services/ProductosServices';
import ImagenesService from '../../services/ImagenesService';
import { ActivityIndicator } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function CategoriaScreen() {
    const route = useRoute();
    const [isUploading, setIsUploading] = useState(false);
    const { id_categoria, cat_nom } = route.params || {};
    const navigation = useNavigation();
    const { data: productos, refetch, isLoading: isProductosloading, error } = useMenu("productos", { id_categoria })
    const [estadoFiltro, setEstadoFiltro] = useState(1);
    function filtrarProductosPorEstado(estado) {
        refetch();
        setEstadoFiltro(Number(estado));
    }
    const productosFiltrados = productos.filter(producto =>
        estadoFiltro === -1 || producto.pro_estado === estadoFiltro
    );

    // Crear producto //
    const [imagePreview, setImagePreview] = useState(null);
    const [modalAgregar, setModalAgregar] = useState(false);
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        foto: null,
        puntos: '',
        categoria_id: id_categoria
    })
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
            setProducto({ ...producto, foto });
            setImagePreview(asset.uri);
        }
    };
    const handleChange = (data) => (value) => {
        setProducto({ ...producto, [data]: value });
    }
    const handleSubmit = async () => {
        if (!producto.nombre || !producto.descripcion || !producto.precio || !producto.puntos || !producto.foto) {
            const msg = "Todos los campos son obligatorios";
            showMessage({
                message: msg,
                type: "warning"
            });
            return;
        }
        try {
            setIsUploading(true);
            const id_unico = `producto_${producto.nombre.replace(/\s+/g, '_')}_${Date.now()}`;
            const productoData = {
                id: id_unico,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                puntos: producto.puntos,
                foto: '',
                id_categoria: id_categoria
            };
            const response = await ProductosService.crearProducto(productoData);
            if (response.status === 200) {
                const formData = new FormData();
                formData.append('foto', {
                    uri: producto.foto.uri,
                    type: producto.foto.type,
                    name: producto.foto.name,
                });
                formData.append('upload_preset', 'productos');
                formData.append('public_id', `${id_unico}`);
                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                const url = cloudinaryResponse.data.url;

                await ProductosService.actualizarProducto(id_unico, { foto: url });
                showMessage({ message: "Producto creado con exito", type: "success" });
                setProducto({ nombre: '', descripcion: '', precio: '', puntos: '', foto: null, categoria_id: id_categoria });
                setImagePreview(null);
                refetch();
            }
        } catch (error) {
            console.log(error);
            showMessage({ message: "Error al crear el producto", type: "danger" });
        } finally {
            setModalAgregar(false);
            setIsUploading(false);
        }

    }

    // Editar producto //
    const [modalEditar, setModalEditar] = useState(false);
    const [imagePreviewEditar, setImagePreviewEditar] = useState(null);
    const [productoEditar, setProductoEditar] = useState({
        id: '',
        nombre: '',
        descripcion: '',
        precio: '',
        foto: null,
        puntos: '',
    });
    const editarProducto = (producto) => {
        setProductoEditar({
            id: producto.id_producto,
            nombre: producto.pro_nom,
            descripcion: producto.pro_desp,
            precio: producto.pro_precio,
            foto: producto.pro_foto,
            puntos: producto.pro_puntos,

        });
        setImagePreviewEditar(producto.pro_foto);
        setModalEditar(true);
    }
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
            setProductoEditar({ ...productoEditar, foto });
            setImagePreviewEditar(asset.uri);
        }
    };
    const handleChangeEditar = (data) => (value) => {
        setProductoEditar({ ...productoEditar, [data]: value });
    }
    const handleSubmitEditar = async (id) => {
        if (!productoEditar.nombre || !productoEditar.descripcion || !productoEditar.precio || !productoEditar.puntos || !productoEditar.foto) {
            const msg = "Todos los campos son obligatorios";
            showMessage({
                message: msg,
                type: "warning"
            });
            return;
        }
        try {
            setIsLoading(true);
            const productoData = {
                nombre: productoEditar.nombre,
                descripcion: productoEditar.descripcion,
                precio: productoEditar.precio,
                puntos: productoEditar.puntos,
                foto: '',
            };
            console.log(productoData);
            if (productoEditar.foto && productoEditar.foto.uri) {
                const formData = new FormData();
                formData.append('foto', {
                    uri: productoEditar.foto.uri,
                    type: productoEditar.foto.type,
                    name: productoEditar.foto.name,
                });
                formData.append('upload_preset', 'productos');
                formData.append('public_id', `${id}`);
                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                if (cloudinaryResponse.status == 200) {
                    productoData.foto = cloudinaryResponse.data.url;
                }
            } else {
                productoData.foto = productoEditar.foto;
            }
            const response = await ProductosService.actualizarProducto(id, productoData);
            if (response.status == 200) {
                showMessage({ message: "Producto actualizado con exito", type: "success" });
                setProductoEditar({ id: '', nombre: '', descripcion: '', precio: '', puntos: '', foto: null, categoria_id: id_categoria });
                setImagePreviewEditar(null);
                refetch();
            } else {
                showMessage({ message: "Error al actualizar el producto", type: "danger", duration: 3000 });
            }

        } catch (error) {
            console.log(error);
        } finally {
            setModalEditar(false);
            setIsUploading(false);
        }

    }
    // Eliminar producto //
    const eliminarProducto = async (id) => {
        try {

            Alert.alert(
                "Eliminar producto",
                "¿Deseas eliminar este producto?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        onPress: async () => {
                            try {
                                setIsUploading(true);
                                const response = await ProductosService.eliminarProducto(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Producto eliminado con éxito',
                                        type: 'success',
                                        duration: 2000,
                                        icon: 'success',
                                    })
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                showMessage({
                                    message: 'Error al eliminar el producto',
                                    type: 'danger',
                                    duration: 2000,
                                    icon: 'danger',
                                });
                            }
                        }
                    },
                ]
            );
        }
        catch (error) {
            console.log(error);
        } finally {
            setIsUploading(false)
            refetch();
        }
    }
    const restaurarProducto = async (id) => {
        try {
            Alert.alert(
                "Restaurar producto",
                "¿Deseas eliminar este producto?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Restaurar",
                        onPress: async () => {
                            try {
                                setIsUploading(true);
                                const response = await ProductosService.restaurarProducto(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Producto restaurado con éxito',
                                        type: 'success',
                                        duration: 2000,
                                        icon: 'success',
                                    })
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                showMessage({
                                    message: 'Error al restaurar el producto',
                                    type: 'danger',
                                    duration: 2000,
                                    icon: 'danger',
                                });
                            }
                        }
                    },
                ]
            );
        }
        catch (error) {
            console.log(error);
        } finally {
            setIsUploading(false);
            refetch();
        }
    }
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [id_categoria])
    );

    useEffect(() => {
        const messages = ["Espera...", "Cargando...", "Esto puede tardar un poco...", "Por favor, espera...", "Enviando producto..."];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        if (isUploading) {
            showMessage({
                color: "black",
                message: randomMessage,
                icon: props => <ActivityIndicator size="small" color="black" style={{ height: 20, width: 20, marginRight: 10 }} />,
                type: "warning",
            });
        }
    }, [isUploading]);
    return (
        <AdminLayout>
            <View style={styles.general && styles.container}>
                <Text style={globalStyles.title}>{cat_nom}</Text>

                <View style={styles.up}>
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
                    {/* Modal para agregar */}
                    <Modal
                        visible={modalAgregar}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalAgregar(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContenido}>
                                <Text style={styles.modalTitulo}>Añadir producto</Text>
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
                                    placeholder="Ingrese el nombre del producto"
                                    placeholderTextColor="#aaa"
                                    value={producto.nombre}
                                    onChangeText={handleChange('nombre')}
                                />
                                <Text style={styles.modalLabel} >Descripción</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese la descripción del producto"
                                    placeholderTextColor="#aaa"
                                    value={producto.descripcion}
                                    onChangeText={handleChange('descripcion')}
                                />
                                <Text style={styles.modalLabel} >Precio</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el precio del producto"
                                    placeholderTextColor="#aaa"
                                    value={producto.precio.toString()}
                                    onChangeText={handleChange('precio')}
                                />
                                <Text style={styles.modalLabel} >Puntos</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el precio del producto"
                                    placeholderTextColor="#aaa"
                                    value={producto.puntos.toString()}
                                    onChangeText={handleChange('puntos')}
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

                    {/* Modal para editar */}
                    <Modal
                        visible={modalEditar}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalEditar(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContenido}>
                                <Text style={styles.modalTitulo}>Editar producto</Text>
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
                                    placeholder="Ingrese el nombre del producto"
                                    placeholderTextColor="#aaa"
                                    value={productoEditar.nombre}
                                    onChangeText={handleChangeEditar('nombre')}
                                />
                                <Text style={styles.modalLabel} >Descripción</Text>
                                <TextInput
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese la descripción del producto"
                                    placeholderTextColor="#aaa"
                                    value={productoEditar.descripcion}
                                    onChangeText={handleChangeEditar('descripcion')}
                                />
                                <Text style={styles.modalLabel} >Precio</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el precio del producto"
                                    placeholderTextColor="#aaa"
                                    value={productoEditar.precio.toString()}
                                    onChangeText={handleChangeEditar('precio')}
                                />
                                <Text style={styles.modalLabel} >Puntos</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style={[styles.modalInput]}
                                    placeholder="Ingrese el precio del producto"
                                    placeholderTextColor="#aaa"
                                    value={productoEditar.puntos.toString()}
                                    onChangeText={handleChangeEditar('puntos')}
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
                                            handleSubmitEditar(productoEditar?.id);
                                            setModalEditar(false);

                                        }}
                                    >
                                        <Text style={styles.botonTexto}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>


                    {/* Filtro */}

                    <Picker style={styles.picker}
                        selectedValue={estadoFiltro} onValueChange={(itemValue) => filtrarProductosPorEstado(itemValue)}>
                        <Picker.Item label="Activos" value={'1'} />
                        <Picker.Item label="Inactivos" value={'0'} />
                        <Picker.Item label="Todos" value={'-1'} />
                    </Picker>
                </View>
                {/*Contenido */}
                <View >
                    {isProductosloading || !productos ? (
                        <View>
                            <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>Cargando productos...</Text>
                            <Loader />
                        </View>
                    ) : (

                        <View style={globalStyles.row}>
                            {productosFiltrados.map((producto) => (
                                <View key={producto.id_producto} style={globalStyles.card}>
                                    <TouchableOpacity key={producto.id_producto} onPress={() => navigation.navigate('Producto', { id_producto: producto.id_producto, pro_nom: producto.pro_nom })}>
                                        <Image style={globalStyles.img} source={{ uri: producto.pro_foto }} />
                                    </TouchableOpacity>
                                    <View style={globalStyles.cardContent}>
                                        <Text style={globalStyles.cardText}>{producto.pro_nom}</Text >
                                    </View>
                                    <View style={globalStyles.cardActions}>
                                        <TouchableOpacity onPress={() => editarProducto(producto)} style={globalStyles.cardEdit}>
                                            <Ionicons name="create-outline" size={20} color="black" />
                                        </TouchableOpacity>
                                        {producto.pro_estado == 1 ? (
                                            <TouchableOpacity style={globalStyles.cardDelete}
                                                onPress={() => eliminarProducto(producto.id_producto)}>
                                                <Ionicons name="trash-outline" size={20} color="white" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => restaurarProducto(producto.id_producto)} style={globalStyles.cardRestore} >
                                                <Ionicons name="refresh-outline" size={20} color="white" />
                                            </TouchableOpacity>
                                        )}

                                    </View>
                                </View>



                            ))}
                        </View>

                    )
                    }
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
    },
    picker: {
        color: '#fff',
        backgroundColor: '#565E64',
        height: 50,
        width: 170,
        fontSize: 16,
        borderRadius: 10,
    },
    container: {
        marginTop: 50
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
        height: '85%',
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
    //Estilos para el texto de los botones
    botonTexto: {
        color: '#fff',
        fontSize: 16
    },

});

