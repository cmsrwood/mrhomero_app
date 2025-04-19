import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Alert } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import useRecompensas from '../../hooks/useRecompensas';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import RecompensasService from '../../services/RecompensasService';
import ImagenesService from '../../services/ImagenesService';
import { showMessage } from 'react-native-flash-message';
import Loader from '../../components/Loader';

export default function RecompensasAdminScreen() {

    const navigation = useNavigation();

    const { data: recompensas, loading, error, refetch } = useRecompensas("recompensas");

    const [estadoFiltro, setEstadoFiltro] = useState(1);

    function filtrarRecompensasPorEstado(estado) {
        refetch();
        setEstadoFiltro(estado);
    }

    const recompensasFiltradas = recompensas
        .filter(recompensa => {
            return estadoFiltro == -1 || recompensa.recomp_estado == estadoFiltro;
        });

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
            // 1. Crear la recompensa sin imagen
            const id_unico = `recompensa_${categoria.categoria.replace(/\s+/g, '_')}_${Date.now()}`;
            const categoriaData = {
                id: id_unico,
                categoria: categoria.categoria,
                foto: '',
            };

            const response = await RecompensasService.crearRecompensa(categoriaData);

            if (response.status === 200) {
                // 2. Subir la imagen a Cloudinary
                const formData = new FormData();
                formData.append('foto', {
                    uri: categoria.foto.uri,
                    type: categoria.foto.type,
                    name: categoria.foto.name,
                });
                formData.append('upload_preset', 'recompensas');
                formData.append('public_id', `categoria_${categoria.categoria}_${id_unico}`);

                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                const url = cloudinaryResponse.data.url;

                // 3. Actualizar la categoría con la URL de la imagen
                await RecompensasService.actualizarRecompensa(id_unico, { foto: url });

                // Éxito
                showMessage({ message: "Categoría creada con éxito", type: "success" });
                setCategoria({ categoria: '', foto: null });
                setImagePreview(null);
                refetch();
            }
        } catch (error) {
            console.error(error);
            alert("Error al crear la recompensa.");
        }
        setModalVisible(false);
    };

    const eliminarRecompensa = async (id) => {
        try {
            Alert.alert(
                "Eliminar recompensa",
                "¿Deseas eliminar esta recompensa?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        onPress: async () => {
                            try {
                                const response = await RecompensasService.eliminarRecompensa(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Recompensa eliminada con éxito',
                                        type: 'success',
                                        duration: 3000,
                                        icon: 'success',
                                    })
                                }
                                refetch();
                            } catch (error) {
                                console.error('Error:', error);
                                showMessage({
                                    message: 'Error al eliminar la recompensa',
                                    type: 'danger',
                                    duration: 3000
                                });
                                refetch();
                            }
                        }
                    },
                ]
            );
        }
        catch (error) {
            console.log(error);
        }
    }

    const restaurarRecompensa = async (id) => {
        try {
            Alert.alert(
                "Restaurar recompensa",
                "¿Deseas restaurar esta recompensa?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Restaurar",
                        onPress: async () => {
                            try {
                                const response = await RecompensasService.restaurarRecompensa(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Recompensa restaurada con éxito',
                                        type: 'success',
                                        duration: 3000,
                                        icon: 'success',
                                    })
                                }
                                refetch();
                            } catch (error) {
                                console.error('Error:', error);
                                showMessage({
                                    message: 'Error al restaurar la recompensa',
                                    type: 'danger',
                                    duration: 3000
                                });
                                refetch();
                            }
                        }
                    },
                ]
            );
        }
        catch (error) {
            console.log(error);
        }
    }

    const [recompensaModal, setRecompensaModal] = useState(null);

    const [recompensaModalShow, setRecompensaModalShow] = useState(false);

    return (
        <AdminLayout>
            <View style={styles.general}>
                <Text style={globalStyles.title}>Recompensas</Text>
                <View style={styles.up}>
                    <TouchableOpacity style={styles.add}
                        onPress={
                            () => {
                                setModalVisible(true);
                            }
                        }>
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text style={styles.botonTexto} >Añadir</Text>
                    </TouchableOpacity>

                    <Picker style={styles.picker} mode="dropdown" selectedValue={estadoFiltro} onValueChange={(itemValue) => filtrarRecompensasPorEstado(itemValue)}>
                        <Picker.Item label="Activos" value={'1'} />
                        <Picker.Item label="Inactivos" value={'0'} />
                        <Picker.Item label="Todos" value={'-1'} />
                    </Picker>

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
                                <Text style={styles.modalTitulo}>Añadir recompensa</Text>
                                <Text style={styles.modalLabel}>Imagen</Text>
                                <View style={styles.imageSection}>
                                    <Text style={styles.sectionLabel}>Imagen de la recompensa</Text>
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
                                    placeholder="Ingrese el nombre de la recompensa"
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

                    <Modal visible={recompensaModalShow == true} animationType="slide" transparent={true} onRequestClose={() => setRecompensaModal(null)}>
                        {recompensaModal !== null ? null : <Loader />}
                        <View style={styles.modalContainer}>
                            <TouchableOpacity style={globalStyles.botonCerrar} onPress={() => setRecompensaModalShow(false)}>
                                <View >
                                    <Ionicons name="close" size={24} color="black" />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.modalContenidoU}>
                                <Card style={styles.cardModal}>
                                    <Image source={{ uri: recompensaModal?.recomp_foto }} style={styles.imgModal} />
                                    <View style={styles.cardContent}>
                                        <View>
                                            <Text style={[styles.modalTitulo, { textAlign: 'center' }]}>{recompensaModal?.recompensa_nombre}</Text>
                                            <Text style={[styles.modalTitulo, { textAlign: 'center', color: 'white' }]}>{recompensaModal?.recomp_num_puntos} puntos</Text>
                                            <Text style={styles.modalLabel}>{recompensaModal?.recompensa_descripcion}</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                        <Text style={recompensaModal?.recomp_estado === 1 ? styles.positive : styles.negative}>{recompensaModal?.recomp_estado === 1 ? 'Activo' : 'Inactivo'}</Text>
                                    </View>
                                </Card>
                            </View>
                        </View>
                    </Modal>

                </View>

                {/* CARTAS PARA RECOMPENSAS */}
                <View style={globalStyles.row}>
                    {recompensasFiltradas.length === 0 && <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>No hay recompensas disponibles</Text>}
                    {recompensasFiltradas.map((recompensa) => (
                        <Card key={recompensa.id_recomp} style={globalStyles.card}>
                            <TouchableOpacity onPress={() => { setRecompensaModal(recompensa); setRecompensaModalShow(true) }}>
                                <Image source={{ uri: recompensa.recomp_foto }} style={globalStyles.img} />
                            </TouchableOpacity>
                            <View style={globalStyles.cardContent}>
                                <View>
                                    <Text style={globalStyles.cardText} numberOfLines={1} ellipsizeMode="tail">
                                        {recompensa.recompensa_nombre}
                                    </Text>
                                </View>
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={recompensa.recomp_estado === 1 ? [globalStyles.cardText, globalStyles.positive] : [globalStyles.cardText, globalStyles.negative]}>
                                        {recompensa.recomp_estado === 1 ? 'Activo' : 'Inactivo'}
                                    </Text>
                                </View>
                                <View style={globalStyles.cardActions}>
                                    <TouchableOpacity style={globalStyles.cardEdit}>
                                        <Ionicons name="create-outline" size={20} color="black" ></Ionicons>
                                    </TouchableOpacity>
                                    {recompensa.recomp_estado == 1 ?
                                        <TouchableOpacity onPress={() => eliminarRecompensa(recompensa.id_recomp)} style={globalStyles.cardDelete}>
                                            <Ionicons name="trash-outline" size={20} color="white" ></Ionicons>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => restaurarRecompensa(recompensa.id_recomp)} style={globalStyles.cardRestore}>
                                            <Ionicons name="reload-outline" size={20} color="white" ></Ionicons>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

            </View >
        </AdminLayout >
    )
}


const styles = StyleSheet.create({
    general: {
        padding: 0,
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
        backgroundColor: '#5C636A',
        color: '#fff',
        height: 50,
        width: 170,
        fontSize: 16,
    },

    // Modal para añadir
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

    // Modal para añadir
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

    // Modal para cada recompensa
    cardModal: {
        display: 'flex',
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#2B3035',
    },
    imgModal: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    modalContenidoU: {
        width: 330,
        height: 600,
        backgroundColor: '#2B3035',
        borderRadius: 15,
    },
})
