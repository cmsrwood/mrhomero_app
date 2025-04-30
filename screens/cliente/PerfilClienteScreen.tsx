import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Dimensions, TouchableOpacity, TextInput, StyleSheet, Image, Modal, Pressable } from 'react-native'
import ClienteLayout from '../../components/ClienteLayout'
import globalStyles from '../../styles/globalStyles';
import useAuth from '../../hooks/useAuth';
import useClientes from '../../hooks/useClientes';
import ClientesService from '../../services/ClientesServices';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native-paper';
import ImagenesService from '../../services/ImagenesService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../../services/AuthService';

export default function PerfilCliente() {

    const { logout } = useAuth();
    const { data: cliente, isLoading: isLoadingCliente, refetch: refetchCliente } = useClientes("clienteConToken");
    const [refreshing, setRefreshing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFotoVisible, setModalFotoVisible] = useState(false);
    const [isEditing, setIsEditing] = useState('');

    const [editarUser, setEditarUser] = useState({
    });

    const iniciales = () => {
        let iniciales = "";
        if (!cliente.user_nom) return iniciales;
        let nombres = cliente.user_nom.split(" ");
        let apellidos = cliente.user_apels.split(" ");
        for (let i = 0; i < 1; i++) {
            iniciales += nombres[i].charAt(0);
            iniciales += apellidos[i].charAt(0);
        }
        return iniciales;
    }

    const openModal = async (param) => {
        setModalVisible(true);
        setEditarUser({
            user_nom: cliente.user_nom,
            user_apels: cliente.user_apels,
            user_tel: cliente.user_tel,
            user_email: cliente.user_email,
            user_foto: cliente.user_foto
        });
        setIsEditing(param);
    }

    const openModalFoto = async () => {
        setModalFotoVisible(true);
    }

    const closeModal = async () => {
        setModalVisible(false);
        setTimeout(() => {
            setIsEditing('');
        }, 300);
    }

    function capitalizarPrimeraLetra(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const [isUploading, setIsUploading] = useState(false);

    const handleEditarPerfil = async (nuevoUsuario = editarUser) => {
        try {
            setIsUploading(true);
            const response = await ClientesService.actualizarCliente(nuevoUsuario);
            if (response.status === 200) {
                showMessage({
                    message: "Perfil actualizado",
                    type: "success",
                    duration: 2000,
                    icon: "success",
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsUploading(false);
            refetchCliente();
        }
    };



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
            };

            const formData = new FormData();

            formData.append('foto', {
                uri: foto.uri,
                type: foto.type,
                name: foto.name,
            });

            formData.append('upload_preset', 'usuarios');
            formData.append('public_id', cliente.id_user);
            console.log(cliente.id_user);
            try {
                setIsUploading(true);
                const cloudinaryResponse = await ImagenesService.subirImagen(formData);
                if (cloudinaryResponse.status === 200) {
                    ClientesService.actualizarCliente({
                        user_foto: cloudinaryResponse.data.url
                    });
                }
            } catch (error) {

            } finally {
                setIsUploading(false);
                refetchCliente();
            }
        }
    }


    const onRefresh = useCallback(() => {
        setRefreshing(true)
        Promise.all([
            refetchCliente()
        ]).then(() => {
            setRefreshing(false)
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            refetchCliente()
        }, [])
    )

    useEffect(() => {
        const messages = ["Espera...", "Cargando...", "Esto puede tardar un poco...", "Por favor, espera...", "Actualizando perfil..."];
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
        <ClienteLayout refreshing={refreshing} onRefresh={onRefresh}>
            <View>
                <View style={[globalStyles.container, styles.container]}>
                    <Text style={globalStyles.title}>Perfil</Text>
                    {cliente?.user_foto ?
                        <View>
                            <TouchableOpacity onPress={() => openModalFoto()} >
                                <Image style={styles.img} source={{ uri: cliente?.user_foto }} />
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.imgPlaceholder}>
                            <Text style={[styles.iniciales, globalStyles.naranja]}>{iniciales()}</Text>
                        </View>
                    }
                    <TouchableOpacity onPress={() => handleSeleccionarImagen()}><Text style={styles.cambiar}>Cambiar foto de perfil</Text></TouchableOpacity>
                </View>
                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.TextTitle}>Nombres</Text>
                        <TouchableOpacity onPress={() => openModal('nombres')}>
                            <Text style={styles.TextInfo}>{cliente?.user_nom}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.TextTitle}>Apellidos</Text>
                        <TouchableOpacity onPress={() => openModal('apellidos')}>
                            <Text style={styles.TextInfo}>{cliente?.user_apels}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.TextTitle}>Email</Text>
                        <TouchableOpacity onPress={() => openModal('email')}>
                            <Text style={styles.TextInfo}>{cliente?.user_email}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formGroup} >
                        <Text style={styles.TextTitle}>Telefono</Text>
                        <TouchableOpacity onPress={() => openModal('telefono')}>
                            <Text style={styles.TextInfo}>{cliente?.user_tel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={globalStyles.button} onPress={() => logout()}>
                    <Text>Cerrar sesion</Text>
                </TouchableOpacity>
            </View>
            {/* MODAL */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                style={styles.modal}
            >
                <View style={styles.modalContent} >
                    {isEditing == '' && <Text style={styles.TextTitle}>No se ha seleccionado nada</Text>}
                    {isEditing &&
                        <View>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => closeModal()} >
                                    <Ionicons name="close" size={30} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>{capitalizarPrimeraLetra(isEditing)}</Text>
                                <TouchableOpacity onPress={() => handleEditarPerfil() && closeModal()} >
                                    <Ionicons name="checkmark" size={30} color="#0095f6" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <Text style={styles.TextTitle}>{capitalizarPrimeraLetra(isEditing)}</Text>
                                <TextInput placeholderTextColor={"#ccc"} placeholder={capitalizarPrimeraLetra(isEditing)} style={styles.TextInfo} value={editarUser[isEditing === 'nombres' ? 'user_nom' : isEditing === 'apellidos' ? 'user_apels' : isEditing === 'email' ? 'user_email' : isEditing === 'telefono' && 'user_tel']} onChangeText={(text) => { setEditarUser({ ...editarUser, [isEditing === 'nombres' ? 'user_nom' : isEditing === 'apellidos' ? 'user_apels' : isEditing === 'email' ? 'user_email' : isEditing === 'telefono' && 'user_tel']: text }) }} />
                            </View>
                        </View>
                    }
                </View>
            </Modal>
            <Modal
                visible={modalFotoVisible}
                animationType="fade"
                transparent={true}
                style={styles.modal}
            >
                <Pressable onPress={() => setModalFotoVisible(false)} style={styles.modalFotoContent} >
                </Pressable>
                <Image style={styles.imgVer} source={{ uri: cliente?.user_foto }} />
            </Modal>
        </ClienteLayout >
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    img: {
        width: 110,
        height: 110,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    imgPlaceholder: {
        position: "relative",
        width: 110,
        height: 110,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 100,
    },
    cambiar: {
        fontSize: 14,
        paddingTop: 10,
        color: "#0095f6",
    },
    iniciales: {
        position: "absolute",
        top: '24%',
        left: '29%',
        fontSize: 40,
    },
    form: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        paddingHorizontal: 10,
        width: '100%',
    },
    formGroup: {
        justifyContent: "center",
        gap: 10,
        padding: 10,
        width: '100%',
    },
    TextTitle: {
        color: "#aaaaaa",
        fontSize: 14,
    },
    TextInfo: {
        color: "#fff",
        fontSize: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        height: 40,
        width: '100%',
        borderRadius: 15,
        padding: 10,
        color: "#fff"
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#2B3035',
        padding: 20,
        width: '100%',
        height: '100%',
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        color: '#fff'
    },
    modalBody: {
        gap: 10,
        width: '100%',
        marginVertical: 30,
    },
    modalFotoContent: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgVer: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 100,
        zIndex: 10,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -100 }]
    },
})