import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'
import globalStyles from '../../styles/globalStyles';
import ClienteLayout from '../../components/ClienteLayout';
const { width, height } = Dimensions.get('window');

export default function HistorialCliente() {
    return (
        <ClienteLayout>
            <View>
                <Text style={globalStyles.title}>Historial</Text>
            </View>
        </ClienteLayout >
    )
}
