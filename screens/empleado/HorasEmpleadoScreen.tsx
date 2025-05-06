import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EmpleadoLayout from '../../components/EmpleadoLayout';
import globalStyles from '../../styles/globalStyles';
import moment from 'moment';
import EmpleadoServices from '../../services/EmpleadosService';
import { showMessage } from 'react-native-flash-message';


export default function Horas() {

    const fecha = moment().format('YYYY-MM-DD');


    const iniciarHora = async () => {
        const hora_inicio = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            const response = await EmpleadoServices.iniciarHoraTrabajo(fecha, hora_inicio);

            if (response.status === 200) {
                showMessage({
                    message: 'Hora iniciada con éxito.',
                    type: 'success',
                    duration: 2000,
                    icon: 'success'
                })
            }
        } catch (error) {
            console.log('Error: ', error);
            showMessage({
                message: 'Error al iniciar la hora',
                type: 'danger',
                duration: 2000,
                icon: 'danger'
            })
        }
    }


    const terminarHora = async () => {
        try {
            const hora_fin = moment().format('YYYY-MM-DD HH:mm:ss');

            const response = await EmpleadoServices.terminarHoraTrabajo(fecha, hora_fin);

            if (response.status === 200) {
                showMessage({
                    message: 'Hora terminada con éxito.',
                    type: 'success',
                    duration: 2000,
                    icon: 'success'
                })
            }
        } catch (error) {
            console.log('Error: ', error);
            showMessage({
                message: 'Error al terminar la hora',
                type: 'danger',
                duration: 2000,
                icon: 'danger'
            })
        }
    }
    return (
        <EmpleadoLayout>
            <View style={styles.container}>
                <Text style={[globalStyles.title, { fontSize: 40 }]}>Control de tiempo</Text>
                <View>
                    <TouchableOpacity style={{ height: 50, backgroundColor: '#FF6B4A', justifyContent: 'center', alignItems: 'center' }} onPress={iniciarHora}>
                        <Text>Iniciar hora</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ height: 50, backgroundColor: '#FF6B4A', justifyContent: 'center', alignItems: 'center' }} onPress={terminarHora}>
                        <Text>Terminar hora</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </EmpleadoLayout >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
});