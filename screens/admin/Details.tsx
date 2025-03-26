import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Details({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Bye Muñoz</Text>
            <Button title="Volver" onPress={() => navigation.goBack()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});