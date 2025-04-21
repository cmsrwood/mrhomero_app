import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, Platform } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import useRecompensas from '../../hooks/useRecompensas';
import { ActivityIndicator, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import RecompensasService from '../../services/RecompensasService';
import ImagenesService from '../../services/ImagenesService';
import { showMessage } from 'react-native-flash-message';
import Loader from '../../components/Loader';

export default function RecompensasAdminScreen() {

    const navigation = useNavigation();

    const { data: recompensas, error, refetch } = useRecompensas("recompensas");

    const [estadoFiltro, setEstadoFiltro] = useState(1);

    const [isLoading, setIsLoading] = useState(false);

    function filtrarRecompensasPorEstado(estado) {
        refetch();
        setEstadoFiltro(estado);
    }

    const recompensasFiltradas = recompensas
        .filter(recompensa => {
            return estadoFiltro == -1 || recompensa.recomp_estado == estadoFiltro;
        });

    const [modalVisible, setModalVisible] = useState(false);

    const [imagePreview, setImagePreview] = useState(null);

    const [imagePreviewEditar, setImagePreviewEditar] = useState(null);

    // Recompensa
    const [recompensa, setRecompensa] = useState({
        nombre: '',
        descripcion: '',
        puntos: 0,
        foto: null
    })

    const [recompensaEditar, setRecompensaEditar] = useState({
        id: '',
        nombre: '',
        descripcion: '',
        puntos: 0,
        foto: null
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
            setRecompensa({ ...recompensa, foto });
            setImagePreview(asset.uri);
        }
    };

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
            setRecompensaEditar({ ...recompensaEditar, foto });
            setImagePreviewEditar(asset.uri);
        }
    };

    const handleChange = (data) => (value) => {
        setRecompensa({ ...recompensa, [data]: value });
    };

    const handleChangeEditar = (data) => (value) => {
        setRecompensaEditar({ ...recompensaEditar, [data]: value });
    }

    const handleSubmit = async () => {
        if (!recompensa.nombre || !recompensa.foto || !recompensa.descripcion || !recompensa.puntos) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        try {
            setIsLoading(true);
            // 1. Crear la recompensa sin imagen
            const nombre_sin_espacios = recompensa.nombre.replace(/\s+/g, '_');
            const id_unico = `recompensa_${nombre_sin_espacios}_${Date.now()}`;
            const recompensaData = {
                id: id_unico,
                nombre: recompensa.nombre,
                descripcion: recompensa.descripcion,
                puntos: recompensa.puntos,
                foto: ''
            };

            const response = await RecompensasService.crearRecompensa(recompensaData);

            if (response.status === 200) {
                // 2. Subir la imagen a Cloudinary
                const formData = new FormData();
                formData.append('foto', {
                    uri: recompensa.foto.uri,
                    type: recompensa.foto.type,
                    name: recompensa.foto.name,
                });
                formData.append('upload_preset', 'recompensas');
                formData.append('public_id', `${id_unico}`);

                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                const url = cloudinaryResponse.data.url;

                // 3. Actualizar la recompensa con la URL de la imagen

                const response = await RecompensasService.actualizarRecompensa(id_unico, { foto: url });

                if (response.status == 200) {
                    setIsLoading(false);
                    showMessage({ message: "Recompensa creada con éxito", type: "success", duration: 3000, icon: "success" });
                    setRecompensa({ nombre: '', descripcion: '', puntos: 0, foto: null });
                    setImagePreview(null);
                    refetch();
                }


            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            showMessage({
                message: "Error al crear la recompensa",
                type: "danger",
                duration: 3000,
                icon: "danger",
            });

        }
        setModalVisible(false);
    };

    const handleSubmitEdit = async (id) => {
        if (!recompensaEditar.nombre || !recompensaEditar.puntos || !recompensaEditar.descripcion) {
            alert("Nombre, descripción y puntos son obligatorios.");
            return;
        }

        try {
            setIsLoading(true);
            const recompensaData = {
                nombre: recompensaEditar.nombre,
                descripcion: recompensaEditar.descripcion,
                puntos: recompensaEditar.puntos,
                foto: ''
            };

            if (recompensaEditar.foto && recompensaEditar.foto.uri) {
                const formData = new FormData();
                formData.append('foto', {
                    uri: recompensaEditar.foto.uri,
                    type: recompensaEditar.foto.type,
                    name: recompensaEditar.foto.name,
                });
                formData.append('upload_preset', 'recompensas');
                formData.append('public_id', id);

                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                if (cloudinaryResponse.status == 200) {
                    recompensaData.foto = cloudinaryResponse.data.url;
                }
            } else {
                recompensaData.foto = recompensaEditar.foto;
            }

            const response = await RecompensasService.actualizarRecompensa(id, recompensaData);

            if (response.status == 200) {
                setIsLoading(false);
                setImagePreviewEditar(null);
                setRecompensaEditar({ id: '', nombre: '', descripcion: '', puntos: 0, foto: null });
                showMessage({
                    message: "Recompensa actualizada con éxito",
                    type: "success",
                    duration: 3000,
                    icon: "success",
                });
                refetch();
            }
            else {
                showMessage({
                    message: "Error al actualizar la recompensa",
                    type: "danger",
                    duration: 3000,
                    icon: "danger",
                })
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRecompensaEditarModalShow(false);
        }
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
                                setIsLoading(true);
                                const response = await RecompensasService.eliminarRecompensa(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Recompensa eliminada con éxito',
                                        type: 'success',
                                        duration: 3000,
                                        icon: 'success',
                                    })
                                }
                                setIsLoading(false);
                                refetch();
                            } catch (error) {
                                console.error('Error:', error);
                                showMessage({
                                    message: 'Error al eliminar la recompensa',
                                    type: 'danger',
                                    duration: 3000,
                                    icon: 'danger',
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
                                setIsLoading(true);
                                const response = await RecompensasService.restaurarRecompensa(id);
                                if (response.status == 200) {
                                    showMessage({
                                        message: 'Recompensa restaurada con éxito',
                                        type: 'success',
                                        duration: 3000,
                                        icon: 'success',
                                    })
                                }
                                setIsLoading(false);
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

    const [recompensaModal, setRecompensaModal] = useState({
        recomp_foto: null,
        recompensa_nombre: '',
        recompensa_descripcion: '',
        recomp_num_puntos: 0,
        recomp_estado: 0
    });

    const [recompensaModalShow, setRecompensaModalShow] = useState(false);

    const [recompensaEditarModalShow, setRecompensaEditarModalShow] = useState(false);

    // Colocar informacion en el modal
    const editarModal = (recompensa) => {
        setRecompensaEditar({
            id: recompensa.id_recomp,
            nombre: recompensa.recompensa_nombre,
            descripcion: recompensa.recompensa_descripcion,
            puntos: recompensa.recomp_num_puntos,
            foto: recompensa.recomp_foto
        });
        setImagePreviewEditar(recompensa.recomp_foto);
        setRecompensaEditarModalShow(true);
    }

    const messages = ["Espera...", "Cargando...", "Esto puede tardar un poco...", "Por favor, espera...", "Enviando recompensa..."];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Dentro de tu componente:
    useEffect(() => {
        if (isLoading) {
            showMessage({
                color: "black",
                message: randomMessage,
                icon: props => <ActivityIndicator size="small" color="black" style={{ height: 20, width: 20, marginRight: 10 }} />,
                type: "warning",
            });
        }
    }, [isLoading, randomMessage]);
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

                    <Picker style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker} mode="dialog" itemStyle={Platform.OS === 'ios' ? styles.colorLetterIOS : {}} selectedValue={estadoFiltro} onValueChange={(itemValue) => filtrarRecompensasPorEstado(itemValue)}>
                        <Picker.Item label="Activos" value={'1'} />
                        <Picker.Item label="Inactivos" value={'0'} />
                        <Picker.Item label="Todos" value={'-1'} />
                    </Picker>

                    {/* Modal para añadir recompensa */}

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
                                <View style={styles.form}>
                                    <View>
                                        <Text style={styles.modalLabel} >Nombre</Text>
                                        <TextInput
                                            style={[styles.modalInput]}
                                            placeholder="Ingrese el nombre de la recompensa"
                                            placeholderTextColor={"#aaa"}
                                            value={recompensa.nombre}
                                            onChangeText={handleChange('nombre')}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.modalLabel}>Descripcion</Text>
                                        <TextInput
                                            style={[styles.modalInput]}
                                            placeholder="Ingrese la descripcion de la recompensa"
                                            placeholderTextColor="#aaa"
                                            value={recompensa.descripcion}
                                            onChangeText={handleChange('descripcion')}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.modalLabel}>Puntos</Text>
                                        <TextInput
                                            keyboardType='numeric'
                                            style={[styles.modalInput]}
                                            placeholder="Ingrese los puntos de la recompensa"
                                            placeholderTextColor="#aaa"
                                            value={recompensa.puntos.toString()}
                                            onChangeText={handleChange('puntos')}
                                        />
                                    </View>
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
                                            <Text style={styles.botonTexto}>{isLoading ? <Loader /> : "Guardar"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal para cada recompensa */}

                    <Modal visible={recompensaModalShow == true} animationType="slide" transparent={true} onRequestClose={() => setRecompensaModal(null)}>
                        {recompensaModal !== null ? null : <Loader />}
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContenidoU}>
                                <TouchableOpacity style={globalStyles.botonCerrar} onPress={() => setRecompensaModalShow(false)}>
                                    <View >
                                        <Ionicons name="close" size={24} color="black" />
                                    </View>
                                </TouchableOpacity>
                                <Card style={styles.cardModal}>
                                    <Image source={{ uri: recompensaModal?.recomp_foto }} style={styles.imgModal} />
                                    <View style={globalStyles.cardContent}>
                                        <View>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.modalTitulo, { textAlign: 'center', }]}>{recompensaModal?.recompensa_nombre}</Text>
                                            <Text style={[styles.modalTitulo, { textAlign: 'center', color: 'white' }]}>{recompensaModal?.recomp_num_puntos} puntos</Text>
                                            <Text style={styles.modalLabel}>{recompensaModal?.recompensa_descripcion}</Text>
                                        </View>
                                        <View style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                            <Text style={recompensaModal?.recomp_estado === 1 ? globalStyles.positive : globalStyles.negative}>{recompensaModal?.recomp_estado === 1 ? 'Activo' : 'Inactivo'}</Text>
                                        </View>
                                    </View>
                                </Card>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal para editar */}
                    <Modal
                        visible={recompensaEditarModalShow}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setRecompensaEditarModalShow(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContenido}>
                                <Text style={styles.modalTitulo}>Editar recompensa</Text>
                                <Text style={styles.modalLabel}>Imagen</Text>
                                <View style={styles.imageSection}>
                                    <Text style={styles.sectionLabel}>Imagen de la recompensa</Text>
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
                                <View style={styles.form}>
                                    <View>
                                        <Text style={styles.modalLabel} >Nombre</Text>
                                        <TextInput
                                            style={[styles.modalInput]}
                                            placeholder="Ingrese el nombre de la recompensa"
                                            placeholderTextColor={"#aaa"}
                                            value={recompensaEditar.nombre}
                                            onChangeText={handleChangeEditar('nombre')}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.modalLabel}>Descripcion</Text>
                                        <TextInput
                                            style={[styles.modalInput]}
                                            placeholder="Ingrese la descripcion de la recompensa"
                                            placeholderTextColor="#aaa"
                                            value={recompensaEditar.descripcion}
                                            onChangeText={handleChangeEditar('descripcion')}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.modalLabel}>Puntos</Text>
                                        <TextInput
                                            keyboardType='numeric'
                                            style={[styles.modalInput]}
                                            placeholder="Ingrese los puntos de la recompensa"
                                            placeholderTextColor="#aaa"
                                            value={recompensaEditar.puntos.toString()}
                                            onChangeText={handleChangeEditar('puntos')}
                                        />
                                    </View>
                                    <View style={styles.Botones}>
                                        <TouchableOpacity
                                            style={styles.cancelar}
                                            onPress={() => {
                                                setRecompensaEditar({
                                                    id: '',
                                                    nombre: '',
                                                    descripcion: '',
                                                    puntos: 0,
                                                    foto: null
                                                });
                                                setImagePreviewEditar(null);
                                                setRecompensaEditarModalShow(false);
                                            }}
                                        >
                                            <Text style={styles.botonTexto}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.editar}
                                            onPress={() => {
                                                handleSubmitEdit(recompensaEditar?.id);
                                                setRecompensaEditarModalShow(false);
                                            }}
                                        >
                                            <Text style={styles.botonTextoEditar}>Editar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
                                    <TouchableOpacity
                                        style={globalStyles.cardEdit}
                                        onPress={() => editarModal(recompensa)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="create-outline" size={20} color="black" />
                                    </TouchableOpacity>
                                    {recompensa.recomp_estado == 1 ?
                                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => eliminarRecompensa(recompensa.id_recomp)} style={globalStyles.cardDelete}>
                                            <Ionicons name="trash-outline" size={20} color="white" ></Ionicons>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => restaurarRecompensa(recompensa.id_recomp)} style={globalStyles.cardRestore}>
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
        width: Platform.OS === 'ios' ? 170 : 170,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#157347',
        marginHorizontal: Platform.OS === 'ios' ? 10 : 10,
        borderRadius: 10,
    },
    picker: {
        backgroundColor: '#5C636A',
        color: '#fff',
        height: 50,
        width: 170,
        fontSize: 16,
        borderRadius: Platform.OS === 'android' ? 10 : 10,
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

    editar: {
        width: 100,
        height: 50,
        backgroundColor: '#FFC107',
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    botonTextoEditar: {
        color: '#000000',
        fontSize: 16
    },

    // Modal para añadir
    modalInput: {
        borderWidth: 1,
        color: "#fff",
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    placeholderText: {
        marginTop: 8,
        color: '#aaa',
        fontSize: 14,
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
    pickerIOS: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10
    },
    colorLetterIOS: {
        color: '#fff',
    }
})
