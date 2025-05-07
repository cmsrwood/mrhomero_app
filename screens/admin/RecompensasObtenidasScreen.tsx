import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import useRecompensas from '../../hooks/useRecompensas'
import useClientes from '../../hooks/useClientes'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import RecompensasService from '../../services/RecompensasService';
import { showMessage } from 'react-native-flash-message';

export default function RecompensasObtenidasScreen() {


    const [recompensaSeleccionada, setRecompensaSeleccionada] = useState(null)
    const [modalRecompensa, setModalRecompensa] = useState(false)
    const [reclamando, setReclamando] = useState(false)


    const { data: recompensasObtenidas, refetch: refetchRecompensasObtenidas, isLoading: isRecompensasObtenidasLoading, error: recompensasObtenidasError } = useRecompensas('recompensasObtenidas')
    const { data: clientes, refetch: refetchClientes, isLoading: isClientesLoading, error: clientesError } = useClientes('clientes')
    console.log(clientes)
    const { data: recompensas, refetch: refetchRecompensas, isLoading: isRecompensasLoading, error: recompensasError } = useRecompensas('recompensas')

    const openModalRecompensa = (recompensa) => {
        setRecompensaSeleccionada(recompensa)
        setModalRecompensa(true)
    };

    const cerrarModalRecompensa = () => {
        setModalRecompensa(false)
        setTimeout(() => {
            setRecompensaSeleccionada(null)
        }, 300);
    }

    const refetchAll = async () => {
        await refetchRecompensasObtenidas()
        await refetchRecompensas()
        await refetchClientes()
    }

    const handleSubmit = async () => {
        if (recompensaSeleccionada.codigo) {
            try {
                const response = await RecompensasService.validarRecompensa(recompensaSeleccionada.id_recomp_obt, recompensaSeleccionada.codigo)
                if (response.status === 200) {
                    cerrarModalRecompensa()
                    setReclamando(false)
                    refetchAll()
                    setRecompensaSeleccionada(null)
                    showMessage({
                        message: `Recompensa reclamada con éxito`,
                        type: 'success',
                        icon: 'success',
                        duration: 3000
                    })
                } else {
                    setReclamando(false)
                    showMessage({
                        message: `Error al reclamar la recompensa`,
                        type: 'danger',
                        icon: 'danger',
                        duration: 3000
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <AdminLayout>
            <View>
                <Text style={globalStyles.title}>Recompensas obtenidas</Text>
                <View>
                    {isRecompensasObtenidasLoading ? (
                        <Text style={styles.text}>Cargando...</Text>
                    ) : recompensasObtenidasError ? (
                        <Text style={styles.text}>Error: {recompensasObtenidasError.message}</Text>
                    ) : (
                        <View>
                            {recompensasObtenidas.map((recompensa) => (
                                <View key={recompensa.id_recomp_obt}>
                                    <View key={recompensa.id_recomp_obt}>
                                        <TouchableOpacity onPress={() => { openModalRecompensa(recompensa) }}>
                                            <View style={[styles.card]}>
                                                <View style={styles.cardContent}>
                                                    <View style={{ padding: 10, flex: 1 }}>
                                                        <View style={{ paddingEnd: 5 }}>
                                                            <Text style={[globalStyles.naranja, { marginBottom: 10, fontSize: 18, fontWeight: "bold" }]}>{clientes.find(c => c.id_user === recompensa.id_user)?.user_nom} {clientes.find(c => c.id_user === recompensa.id_user)?.user_apels}</Text>
                                                        </View>
                                                        <Text style={{ color: "#fff", marginBottom: 10, fontSize: 18 }}>{recompensas.find(r => r.id_recomp === recompensa.id_recomp)?.recompensa_nombre}</Text>
                                                    </View>
                                                    <View>
                                                        <Image source={{ uri: recompensas.find(r => r.id_recomp === recompensa.id_recomp)?.recomp_foto }} style={styles.img} />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalRecompensa}
                onRequestClose={() => {
                    setModalRecompensa(!modalRecompensa);
                }}
            >
                <TouchableOpacity style={styles.botonCerrar} onPress={cerrarModalRecompensa}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.modalOverlay}>
                    {reclamando ? (
                        <View style={styles.modalContainer}>
                            <Image source={{ uri: recompensas?.find(r => r.id_recomp === recompensaSeleccionada?.id_recomp)?.recomp_foto }} style={styles.imgModal} />
                            <View style={styles.modalContent}>
                                <TextInput
                                    placeholderTextColor={"#fff"}
                                    autoComplete='off'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    keyboardType='numeric'
                                    onChangeText={(text) => setRecompensaSeleccionada({ ...recompensaSeleccionada, codigo: text })}
                                    style={styles.input}
                                    placeholder="Codigo de reclamación"
                                />
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.boton} onPress={handleSubmit}>
                                    <Text style={styles.botonText}>Reclamar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) :
                        <View style={styles.modalContainer}>
                            <Image source={{ uri: recompensas?.find(r => r.id_recomp === recompensaSeleccionada?.id_recomp)?.recomp_foto }} style={styles.imgModal} />
                            <View style={styles.modalContent}>
                                <Text style={[globalStyles.naranja, { fontSize: 20, fontWeight: "bold", marginBottom: 10 }]}>{clientes.find(c => c.id_user === recompensaSeleccionada?.id_user)?.user_nom} {clientes.find(c => c.id_user === recompensaSeleccionada?.id_user)?.user_apels}</Text>
                                <Text style={{ color: "#fff", marginBottom: 10, fontSize: 20 }}>{recompensas.find(r => r.id_recomp === recompensaSeleccionada?.id_recomp)?.recompensa_nombre}</Text>
                                <Text style={{ color: "#fff", marginBottom: 10, fontSize: 16 }}>{recompensas.find(r => r.id_recomp === recompensaSeleccionada?.id_recomp)?.recompensa_descripcion}</Text>
                                <Text style={{ color: "#fff", marginBottom: 10, fontSize: 16 }}>{moment(recompensaSeleccionada?.fecha_reclamo).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View style={styles.modalFooter}></View>
                            <TouchableOpacity style={styles.boton} onPress={() => { setReclamando(true) }}>
                                <Text style={styles.botonText}>Reclamar</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </Modal>
        </AdminLayout >
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    card: {
        paddingHorizontal: 10,
        height: 150,
        backgroundColor: 'transparent',
        marginVertical: 10
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    img: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 15
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#2B3035',
        borderRadius: 20,
        width: '90%',
        overflow: 'hidden',
        minHeight: '80%',
        maxHeight: '80%',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 30,
        paddingHorizontal: 10,
    },
    imgModal: {
        width: '100%',
        height: 300,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        resizeMode: 'cover',
    },
    botonCerrar: {
        backgroundColor: "#FFC107",
        borderRadius: 30,
        padding: 5,
        position: "absolute",
        top: '2%',
        left: '4%',
    },
    modalContent: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        height: 40,
        width: '100%',
        borderRadius: 15,
        padding: 10,
        color: "#fff",
        margin: 10,
        marginVertical: 10
    },
    boton: {
        backgroundColor: "#FFC107",
        borderRadius: 30,
        padding: 10,
    },
    botonText: {
        color: "#2B3035",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    }
})