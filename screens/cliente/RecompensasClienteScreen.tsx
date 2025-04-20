import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'
import ClienteLayout from '../../components/ClienteLayout'
import globalStyles from '../../styles/globalStyles';

export default function RecompensasCliente() {
    return (
        <ClienteLayout>
            <View>
                <Text style={globalStyles.title}>Recompensas</Text>
            </View>
        </ClienteLayout >
    )
}
