import React from 'react'
import Const from 'expo-constants';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import EmpleadoLayout from '../../components/EmpleadoLayout';
import AuthService from '../../services/AuthService';

export default function IndexEmpleado() {

    const handleSubmit = async () => {
        await AuthService.logout();
    }
    return (
        <EmpleadoLayout>
            <View style={styles.container}>
                <View>
                    <Text style={styles.text}>Si lo que buscas es sabor, Mr. Homero es el mejor</Text>
                    <TouchableOpacity onPress={handleSubmit} style={globalStyles.button}>
                        <Text>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </EmpleadoLayout>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Const.statusBarHeight
    },
    img: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 200,
        height: 200,
    },
    text: {
        fontSize: 30,
        flex: 1,
        marginHorizontal: 20,
        marginTop: 25,
        textAlign: 'center'
    }
});
