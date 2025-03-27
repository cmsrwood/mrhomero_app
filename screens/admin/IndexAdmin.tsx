import React from 'react'
import Const from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function IndexAdmin({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Hello Muñoz</Text>
            <Button title="Ir a Detalles" onPress={() => navigation.navigate('Details')} />
            <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
