import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import ClienteLayout from '../../components/ClienteLayout'
import globalStyles from '../../styles/globalStyles'
import useRecompensas from '../../hooks/useRecompensas'
import { Card } from 'react-native-paper'
import moment from 'moment'
import ProgressBar from '../../components/ProgressBar'
import { useFocusEffect } from '@react-navigation/native'

export default function RecompensasCliente() {
    const [filtro, setFiltro] = useState("disponibles")
    const [refreshing, setRefreshing] = useState(false)

    const { data: recompensas, refetch: refetchRecompensas, isLoading: isRecompensasLoading } = useRecompensas("recompensas")
    const { data: recompensasObtenidas, refetch: refetchRecompensasObtenidas, isLoading: isRecompensasObtenidasLoading } = useRecompensas("recompensasObtenidas")
    const { data: puntos, refetch: refetchPuntos, isLoading: isPuntosLoading } = useRecompensas("puntosUsuario")

    function mesANombre(mes) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[mes - 1];
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        Promise.all([
            refetchRecompensas(),
            refetchRecompensasObtenidas(),
            refetchPuntos()
        ]).then(() => {
            setRefreshing(false)
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            refetchRecompensas()
            refetchRecompensasObtenidas()
            refetchPuntos()
        }, [])
    )

    return (
        <ClienteLayout refreshing={refreshing} onRefresh={onRefresh}>
            <View style={globalStyles.container}>
                {isRecompensasLoading || isRecompensasObtenidasLoading && (
                    <Text style={globalStyles.title}>Cargando...</Text>
                )}
                <View>
                    <Text style={globalStyles.title}>Recompensas</Text>
                    {filtro == "disponibles" ? (
                        <View>
                            <TouchableOpacity onPress={() => setFiltro("obtenidas")}>
                                <Text style={styles.filtro}>Ver Recompensas Obtenidas</Text>
                            </TouchableOpacity>
                            {recompensas.length == 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay recompensas disponibles</Text>}
                            {recompensas.map((recompensa) => (
                                <Card key={recompensa.id_recomp} style={[styles.card]}>
                                    <View style={styles.cardContent}>
                                        <View>
                                            <Image style={styles.img} source={{ uri: recompensa.recomp_foto }} />
                                        </View>
                                        <View style={{ padding: 10, flex: 1 }}>
                                            <Text style={{ color: "#fff", marginBottom: 10 }}>{recompensa.recompensa_nombre}</Text>
                                            <Text>{recompensa.recomp_descripcion}</Text>
                                            {
                                                puntos >= recompensa.recomp_num_puntos ? (
                                                    <TouchableOpacity style={styles.button} onPress={() => console.log("Reclamar")}>
                                                        <Text style={styles.buttonText}>Reclamar</Text>
                                                    </TouchableOpacity>
                                                )
                                                    :
                                                    <ProgressBar progress={puntos} meta={recompensa.recomp_num_puntos} />
                                            }
                                        </View>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View>
                            <TouchableOpacity onPress={() => setFiltro("disponibles")}>
                                <Text style={styles.filtro}>Ver Recompensas Disponibles</Text>
                            </TouchableOpacity>
                            {recompensasObtenidas.length == 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No has reclamado ninguna recompensa aún</Text>}
                            {recompensasObtenidas.map((recompensa) => (
                                <Card key={recompensa.id_recomp_obt} style={[styles.card]}>
                                    <View style={styles.cardContent}>
                                        <View>
                                            <Image style={styles.img} source={{ uri: recompensas.find(recomp => recomp.id_recomp == recompensa.id_recomp).recomp_foto }} />
                                        </View>
                                        <View style={{ padding: 10, flex: 1 }}>
                                            <Text style={{ color: "#fff", marginBottom: 10 }}>{recompensas.find(recomp => recomp.id_recomp == recompensa.id_recomp).recompensa_nombre}</Text>
                                            <Text style={{ marginBottom: 10, color: "#fff" }}>
                                                Codigo: <Text style={{ color: "#FFC107", marginBottom: 10 }}>{recompensa.codigo}</Text>
                                            </Text>
                                            <Text style={{ color: "#fff", marginBottom: 10 }}>Lo reclamaste el dia {moment(recompensa.fecha_reclamo).format('DD')} de {mesANombre(moment(recompensa.fecha_reclamo).format('MM'))}</Text>
                                        </View>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </ClienteLayout>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: '#3A4149'
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    img: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    puntos: {
        color: '#fff',
        fontSize: 25,
        marginBottom: 10,
    },
    filtro: {
        color: '#000',
        backgroundColor: '#FFC107',
        fontSize: 16,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        textAlign: 'center'
    }
})