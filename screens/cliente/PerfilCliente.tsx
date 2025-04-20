import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import globalStyles from '../../styles/globalStyles';
import useAuth from '../../hooks/useAuth';
const { width, height } = Dimensions.get('window');

export default function PerfilCliente() {

    const { user, logout } = useAuth();
    return (
        <DefaultLayout>
            <View>
                <Text style={globalStyles.title}>Perfil</Text>
                <TouchableOpacity style={globalStyles.button} onPress={() => logout()}>
                    <Text>Cerrar sesion</Text>
                </TouchableOpacity>
            </View>
        </DefaultLayout >
    )
}
