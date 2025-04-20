import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import globalStyles from '../../styles/globalStyles';
const { width, height } = Dimensions.get('window');

export default function HistorialCliente() {
    return (
        <DefaultLayout>
            <View>
                <Text style={globalStyles.title}>Historial</Text>
            </View>
        </DefaultLayout >
    )
}
