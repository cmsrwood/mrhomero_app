import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import useEmpleados from '../../hooks/useEmpleados'


export default function HorasEmpleadosScreen() {

    const { data: empleados, loading: loadingEmpleados, error: errorEmpleados, refetch: refetchEmpleados } = useEmpleados('Empleados');
    const navigation = useNavigation();

    return (
        <AdminLayout>
            <View style={styles.container}>
                <Text style={[globalStyles.title, { fontSize: 40, marginTop: 30, marginBottom: 30 }]}>Horas de empleados</Text>
                {empleados.map((empleado) => (
                    <View style={styles.containerInfo}>
                        <Image style={styles.image} source={{ uri: empleado.user_foto }}></Image>
                        <View style={styles.containerData}>
                            <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16, maxWidth: 150, marginBottom: 6 }}>{empleado.user_nom} {empleado.user_apels}</Text>
                            <View style={{ flexDirection: 'row', gap: 5, }}>
                                <Ionicons name="call-outline" style={{ color: '#FFC107', fontSize: 14, marginTop: 2, marginRight: 2 }}></Ionicons>
                                <Text style={{ color: '#FFC107', fontSize: 14 }}>{empleado.user_tel ? empleado.user_tel : 'Sin teléfono'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="information-circle-outline" size={20} color="#fff"
                                onPress={() => navigation.navigate('GestionHoras', { id: empleado.id_user })}
                            ></Ionicons>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </AdminLayout >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    containerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A4149',
        borderWidth: 1,
        borderColor: '#4A5159',
        borderRadius: 8,
        width: '90%',
        height: 100,
        padding: 10,
        gap: 20,
        marginBottom: 14
    },
    containerData: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',

    },
    button: {
        backgroundColor: '#FFC107',
        borderRadius: 100,
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    }
})