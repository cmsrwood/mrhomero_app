import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
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
                    {filtro == "disponibles" ? (
                        <View>
                            <Text style={globalStyles.title}>Recompensas Disponibles</Text>
                            <Text style={styles.puntos}>Puntos: {puntos}</Text>
                            {recompensas.map((recompensa) => (
                                <Card key={recompensa.id_recomp} style={[styles.card]}>
                                    <View style={styles.cardContent}>
                                        <View>
                                            <Image style={styles.img} source={{ uri: recompensa.recomp_foto }} />
                                        </View>
                                        <View style={{ padding: 10, flex: 1 }}>
                                            <Text style={{ color: "#fff", marginBottom: 10 }}>{recompensa.recompensa_nombre}</Text>
                                            <Text>{recompensa.recomp_descripcion}</Text>
                                            <ProgressBar progress={puntos} meta={recompensa.recomp_num_puntos} />
                                        </View>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View>
                            <Text style={globalStyles.title}>Recompensas Obtenidas</Text>
                            {recompensasObtenidas.map((recompensa) => (
                                <Card key={recompensa.id_recomp_obt} style={styles.card}>
                                    <View style={{ padding: 10 }}>
                                        <Image source={{ uri: recompensa.recomp_foto }} />
                                    </View>
                                    <View style={{ padding: 10 }}>
                                        <Text>{recompensas.find(recomp => recomp.id_recomp == recompensa._obt).recompensa_nombre}</Text>
                                        <Text>{recompensas.find(recomp => recomp.id_recomp == recompensa._obt).recomp_descripcion}</Text>
                                        <Text>{recompensas.find(recomp => recomp.id_recomp == recompensa._obt).recomp_num_puntos}</Text>
                                        <Text>{moment(recompensa.fecha_reclamo).format("DD/MM/YYYY")}</Text>
                                        <Text>{recompensa.codigo}</Text>
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
        fontSize: 20,
        marginBottom: 10,
    }
})