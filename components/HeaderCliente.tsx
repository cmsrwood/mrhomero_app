import React, { useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import useRecompensas from '../hooks/useRecompensas'
import useClientes from '../hooks/useClientes'
import { ActivityIndicator } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function HeaderCliente() {

    const { data: puntos, isLoading: isPuntosLoading } = useRecompensas("puntosUsuario")
    const { data: cliente, isLoading: isLoadingCliente, refetch: refetchCliente } = useClientes("clienteConToken")

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            refetchCliente();
        }, [])
    );

    return (
        <View style={styles.headerContainer}>
            {isLoadingCliente && <ActivityIndicator color="#F8C60F" />}
            <View style={styles.leftSection}>
                <Text style={styles.saludo}>Hola,</Text>
                <Text style={styles.nombre}>{cliente?.user_nom || 'Usuario'}</Text>
            </View>
            <View style={styles.rightSection}>
                <TouchableOpacity onPress={() => { navigation.navigate('Recompensas') }} style={styles.puntosContainer}>
                    <Ionicons name="star" style={styles.puntosIcon} />
                    <Text style={styles.puntosText}>{isPuntosLoading ? '...' : `${puntos} pts`}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate('Perfil') }} style={styles.perfilBtn}>
                    <Ionicons name="person" style={styles.perfilIcon} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    saludo: {
        color: '#fff',
        fontSize: 16,
    },
    nombre: {
        color: '#F8C60F',
        fontSize: 22,
        fontWeight: 'bold',
    },
    leftSection: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    puntosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A4149',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    puntosIcon: {
        color: '#F8C60F',
        fontSize: 18,
        marginRight: 6,
    },
    puntosText: {
        color: '#F8C60F',
        fontSize: 16,
        fontWeight: '600',
    },
    perfilBtn: {
        backgroundColor: '#F8C60F',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    perfilIcon: {
        color: '#2D3036',
        fontSize: 22,
    },
})
