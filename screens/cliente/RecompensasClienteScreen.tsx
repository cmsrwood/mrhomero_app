import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ClienteLayout from '../../components/ClienteLayout'
import globalStyles from '../../styles/globalStyles'
import useRecompensas from '../../hooks/useRecompensas'
import moment from 'moment'
import ProgressBar from '../../components/ProgressBar'
import { useFocusEffect } from '@react-navigation/native'
import Loader from '../../components/Loader'
import RecompensasService from '../../services/RecompensasService'
import { showMessage } from 'react-native-flash-message'

export default function RecompensasCliente({ }) {
    const [filtro, setFiltro] = useState("disponibles")
    const [refreshing, setRefreshing] = useState(false)
    const [cantidad, setCantidad] = useState(1)
    const [recompensaSeleccionada, setRecompensaSeleccionada] = useState(null)
    const [modalRecompensa, setModalRecompensa] = useState(false)

    const { data: recompensas, refetch: refetchRecompensas, isLoading: isRecompensasLoading } = useRecompensas("recompensas")
    const { data: recompensasObtenidas, refetch: refetchRecompensasObtenidas, isLoading: isRecompensasObtenidasLoading } = useRecompensas("recompensasObtenidasUsuario")
    const { data: puntos, refetch: refetchPuntos, isLoading: isPuntosLoading } = useRecompensas("puntosUsuario")

    const recompensasMap = useMemo(() => {
        return recompensas.reduce((map, recomp) => {
            map[recomp.id_recomp] = recomp;
            return map;
        }, {});
    }, [recompensas]);

    function mesANombre(mes) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return meses[mes - 1]
    }

    const openModalRecompensa = async (recompensa) => {
        setRecompensaSeleccionada(recompensa)
        setModalRecompensa(true)
    }

    const cerrarModalRecompensa = async () => {
        setModalRecompensa(false)
        setCantidad(1)
    }

    const [refetchCliente, setRefetchCliente] = useState(false)

    const handleReclamarRecompensa = async () => {
        try {
            const reclamos = [];
            for (let i = 0; i < cantidad; i++) {
                reclamos.push(RecompensasService.reclamar(recompensaSeleccionada.id_recomp));
            }
            await Promise.all(reclamos);

            await refetchAll();
            setRefetchCliente(!refetchCliente);

            showMessage({
                message: `Recompensa reclamada con éxito (${cantidad} veces)`,
                type: 'success',
                icon: 'success',
                duration: 3000
            })
        } catch (error) {
            console.log(error);
        } finally {
            cerrarModalRecompensa();
            setRefetchCliente(!refetchCliente);
        }
    };

    const refetchAll = async () => {
        try {
            await Promise.all([
                refetchRecompensas(),
                refetchRecompensasObtenidas(),
                refetchPuntos()
            ]);
        } catch (error) {
            console.error("Error al actualizar datos:", error);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Promise.all([
            refetchAll(),
        ]).then(() => {
            setRefreshing(false);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            refetchAll()
        }, [])
    )

    const getRecompensaData = (recompensaObt) => {
        return recompensasMap[recompensaObt.id_recomp] || {};
    }

    return (
        <ClienteLayout refreshing={refreshing} onRefresh={onRefresh} refreshCliente={refetchCliente}>
            <View style={{ paddingHorizontal: 20 }}>
                <View>
                    {isRecompensasLoading || isRecompensasObtenidasLoading && (
                        <Text style={globalStyles.title}>Cargando...</Text>
                    )}
                    <Text style={globalStyles.title}>Recompensas</Text>
                    {filtro == "disponibles" ? (
                        // Recompensas disponibles
                        <View>
                            <TouchableOpacity onPress={() => setFiltro("obtenidas")}>
                                <Text style={styles.filtro}>Ver Recompensas Obtenidas</Text>
                            </TouchableOpacity>
                            {recompensas.length == 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay recompensas disponibles</Text>}
                            {recompensas.map((recompensa) => (
                                <View key={recompensa.id_recomp}>
                                    <TouchableOpacity onPress={() => { openModalRecompensa(recompensa) }}>
                                        <View style={[styles.card]}>
                                            <View style={styles.cardContent}>
                                                <View style={{ padding: 10, flex: 1 }}>
                                                    <Text numberOfLines={2} style={{ color: "#fff", marginBottom: 10, fontSize: 18, fontWeight: "bold" }}>{recompensa.recompensa_nombre}</Text>
                                                    <Text numberOfLines={2} style={{ color: "#bbb", marginBottom: 10 }}>{recompensa.recompensa_descripcion}</Text>
                                                    <View style={{ paddingEnd: 5 }}>
                                                        <ProgressBar progress={puntos} meta={recompensa.recomp_num_puntos} />
                                                    </View>
                                                </View>
                                                <View>
                                                    <Image style={styles.img} source={{ uri: recompensa.recomp_foto }} />
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {puntos >= recompensa.recomp_num_puntos &&
                                        <TouchableOpacity style={styles.botonReclamarCard} onPress={() => setModalRecompensa(false)}>
                                            <View>
                                                <Ionicons name="checkmark-circle" size={20} color="black" />
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            ))}
                        </View>
                    ) : (
                        // Recompensas obtenidas
                        <View>
                            <TouchableOpacity onPress={() => setFiltro("disponibles")}>
                                <Text style={styles.filtro}>Ver Recompensas Disponibles</Text>
                            </TouchableOpacity>
                            {recompensasObtenidas.length == 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay recompensas disponibles</Text>}
                            {recompensasObtenidas.map((recompensa) => {
                                const recompensaData = getRecompensaData(recompensa);
                                return (
                                    <View key={recompensa.id_recomp_obt}>
                                        <TouchableOpacity onPress={() => { openModalRecompensa(recompensa) }}>
                                            <View style={[styles.card]}>
                                                <View style={styles.cardContent}>
                                                    <View style={{ padding: 10, flex: 1 }}>
                                                        <Text numberOfLines={2} style={{ color: "#fff", marginBottom: 10, fontSize: 18, fontWeight: "bold" }}>{recompensaData.recompensa_nombre}</Text>
                                                        <View style={{ paddingEnd: 5 }}>
                                                            <Text style={{ marginBottom: 10, color: "#fff" }}>
                                                                Codigo: <Text style={{ color: "#FFC107", marginBottom: 10 }}>{recompensa.codigo}</Text>
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Image style={styles.img} source={{ uri: recompensaData.recomp_foto }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    )}
                </View>

                {/* Modal de recompensa */}
                <Modal
                    visible={modalRecompensa}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => cerrarModalRecompensa()}
                >
                    <View style={styles.modalOverlay}>
                        {recompensaSeleccionada?.recompensa_nombre ? (
                            <View style={styles.modalContainer}>
                                <Image source={{ uri: recompensaSeleccionada.recomp_foto }} style={styles.imgModal} />
                                <TouchableOpacity style={styles.botonCerrar} onPress={cerrarModalRecompensa}>
                                    <Ionicons name="close" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitulo}>{recompensaSeleccionada.recompensa_nombre}</Text>
                                    <Text style={styles.modalLabel}>{recompensaSeleccionada.recompensa_descripcion}</Text>
                                    <Text style={styles.puntosModal}>{recompensaSeleccionada.recomp_num_puntos} puntos</Text>
                                </View>
                                {puntos >= recompensaSeleccionada.recomp_num_puntos ? (
                                    <View>
                                        <View style={styles.modalFooter}>
                                            <View style={[styles.buttonCancelar]}>
                                                <TouchableOpacity onPress={() => { cantidad > 1 && setCantidad(cantidad - 1) }}>
                                                    <Ionicons color={cantidad == 1 ? "#aaa" : "black"} size={20} name="remove-outline" />
                                                </TouchableOpacity>
                                                <Text style={styles.buttonText}>{cantidad}</Text>
                                                <TouchableOpacity onPress={() => { ((cantidad + 1) * recompensaSeleccionada.recomp_num_puntos) <= puntos && setCantidad(cantidad + 1) }}>
                                                    <Ionicons color="black" size={20} name="add-outline" />
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity disabled={puntos - (cantidad * recompensaSeleccionada.recomp_num_puntos) < 0} style={styles.buttonReclamar} onPress={() => handleReclamarRecompensa()}>
                                                <Text style={styles.buttonText}>Reclamar</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[styles.puntosModal, { color: "#fff", textAlign: "center", marginVertical: 15 }]}>{puntos - cantidad * recompensaSeleccionada.recomp_num_puntos} puntos restantes</Text>
                                    </View>
                                ) : (
                                    <View style={styles.modalFooter}></View>
                                )}
                            </View>
                        ) : recompensaSeleccionada?.codigo ? (
                            <View style={styles.modalContainer}>
                                <Image source={{ uri: recompensasMap[recompensaSeleccionada.id_recomp]?.recomp_foto }} style={styles.imgModal} />
                                <TouchableOpacity style={styles.botonCerrar} onPress={cerrarModalRecompensa}>
                                    <Ionicons name="close" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitulo}>{recompensasMap[recompensaSeleccionada.id_recomp]?.recompensa_nombre}</Text>
                                    <Text style={styles.modalLabel}>{recompensasMap[recompensaSeleccionada.id_recomp]?.recompensa_descripcion}</Text>
                                    <Text style={styles.modalLabel}>Lo reclamaste el dia {moment(recompensaSeleccionada.fecha_reclamo).format('DD')} de {mesANombre(moment(recompensaSeleccionada.fecha_reclamo).format('MM'))}</Text>
                                    <View style={{ alignItems: "center" }}>
                                        <Text style={[{ color: "#FFC107", fontSize: 80, }, globalStyles.fontHomero]}>{recompensaSeleccionada.codigo}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : null}
                    </View>
                </Modal>
            </View>
        </ClienteLayout>
    )
}

const styles = StyleSheet.create({
    card: {
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
    botonReclamarCard: {
        backgroundColor: "#FFC107",
        borderRadius: 30,
        zIndex: 10,
        padding: 5,
        position: "absolute",
        top: '0%',
        right: '-4%',
        flexDirection: "row",
        gap: 5
    },
    filtro: {
        alignSelf: 'center',
        backgroundColor: '#FFC107',
        fontSize: 16,
        marginVertical: 10,
        padding: 10,
        width: '70%',
        borderRadius: 10,
        textAlign: 'center'
    },
    botonCerrar: {
        backgroundColor: "#FFC107",
        borderRadius: 30,
        padding: 5,
        position: "absolute",
        top: '2%',
        left: '4%',
    },
    modalTitulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: "#fff",
        textAlign: "center"
    },
    modalLabel: {
        color: '#bbb',
        marginVertical: 10,
        fontSize: 16,
        textAlign: "center"
    },
    puntosModal: {
        fontSize: 20,
        color: '#FFC107',
        textAlign: "center"
    },
    buttonText: {
        color: '#000',
        textAlign: 'center',
        fontSize: 16,
    },
    imgModal: {
        width: '100%',
        height: 300,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        resizeMode: 'cover',
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
    modalContent: {
        padding: 20,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 30,
        paddingHorizontal: 10,
    },
    buttonReclamar: {
        backgroundColor: '#FFC107',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: '40%',
    },
    buttonCancelar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#aaa',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: '40%',
    },
})