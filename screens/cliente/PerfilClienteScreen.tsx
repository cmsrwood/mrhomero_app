import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import ClienteLayout from '../../components/ClienteLayout'
import globalStyles from '../../styles/globalStyles';
import useAuth from '../../hooks/useAuth';

export default function PerfilCliente() {

    const { user, logout } = useAuth();
    return (
        <ClienteLayout>
            <View>
                <Text style={globalStyles.title}>Perfil</Text>
                <TouchableOpacity style={globalStyles.button} onPress={() => logout()}>
                    <Text>Cerrar sesion</Text>
                </TouchableOpacity>
            </View>
        </ClienteLayout >
    )
}