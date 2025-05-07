import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EmpleadoLayout from '../../components/EmpleadoLayout';
import globalStyles from '../../styles/globalStyles';
import moment from 'moment';
import EmpleadoServices from '../../services/EmpleadosService';
import { showMessage } from 'react-native-flash-message';
import useEmpleados from '../../hooks/useEmpleados';
import { Ionicons } from '@expo/vector-icons';


export default function Horas() {
    const { data: horas, refetch: refetchHoras } = useEmpleados("HoraDia");
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
                await refetchHoras();
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
                await refetchHoras();
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
                <Text style={[globalStyles.title, { fontSize: 40, marginTop: 10 }]}>Control de tiempo</Text>
                {horas.length === 0 ?
                    <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                        <View style={styles.containerHora}>
                            <Ionicons name="time-outline" style={{ color: '#ccc', fontSize: 50, }}></Ionicons>
                            <Text style={{ color: '#ccc', fontSize: 15, fontWeight: 'bold', marginTop: 3 }}> no hay turno activo</Text>
                        </View>

                        <View style={styles.fechaContainer}>
                            <Ionicons name="calendar-outline" style={{ color: '#ffc107', fontSize: 20, }}></Ionicons>
                            <Text style={{ color: '#fff', fontSize: 15 }}>{fecha}</Text>
                        </View>

                        <View style={styles.horaContainer}>
                            <Text style={{ fontSize: 15, color: '#ccc', fontWeight: 'bold' }}>No hay horas registradas</Text>
                        </View>


                        <TouchableOpacity style={[styles.buttonContainer, {
                            flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffc107'
                        }]}
                            onPress={iniciarHora}>
                            <Ionicons name="play" style={{ color: '#fff', fontSize: 20, }}></Ionicons>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Iniciar turno</Text>
                        </TouchableOpacity>
                    </View>

                    :
                    <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                        {horas.hora_fin === null ?
                            <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                                <View style={[styles.containerHora, { borderColor: '#FFC107' }]}>
                                    <Ionicons name="time-outline" style={{ color: '#FFC107', fontSize: 50, }}></Ionicons>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 23, marginVertical: 2 }}>{moment(horas.hora_inicio).format('HH:mm:ss')}</Text>
                                    <Text style={{ color: '#ccc', fontSize: 11, fontWeight: 'bold', marginTop: 3 }}>Turno iniciado</Text>
                                </View>

                                <View style={styles.fechaContainer}>
                                    <Ionicons name="calendar-outline" style={{ color: '#ffc107', fontSize: 20, }}></Ionicons>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>{fecha}</Text>
                                </View>

                                <View style={styles.horaContainer}>
                                    <Text style={{ fontSize: 15, color: '#ccc', fontWeight: 'bold' }}>Turno en progreso</Text>
                                </View>


                                <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#BB2D3B' }]} onPress={terminarHora}>
                                    <Ionicons name="play" style={{ color: '#fff', fontSize: 20, }}></Ionicons>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Terminar turno</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                                <View style={[styles.containerHora, { borderColor: '#198754' }]}>
                                    <Ionicons name="time-outline" style={{ color: '#198754', fontSize: 50, }}></Ionicons>
                                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 3 }}> Fin del turno</Text>
                                </View>

                                <View style={styles.fechaContainer}>
                                    <Ionicons name="calendar-outline" style={{ color: '#ffc107', fontSize: 20, }}></Ionicons>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>{fecha}</Text>
                                </View>

                                <View style={[styles.horaContainer, { justifyContent: 'space-between', height: 'auto' }]}>
                                    <View style={{ alignContent: 'center', justifyContent: 'center', gap: 2 }}>
                                        <Text style={{ fontSize: 15, color: '#ccc', fontWeight: 'bold' }}>Hora de entrada</Text>
                                        <Text style={{ fontSize: 15, color: '#ccc', fontWeight: 'bold', marginLeft: 10 }}>{moment(horas.hora_inicio).format('HH:mm:ss')}</Text>
                                    </View>
                                    <View style={{ alignContent: 'center', justifyContent: 'center', gap: 2 }}>
                                        <Text style={{ fontSize: 15, color: '#ccc', fontWeight: 'bold' }}>Hora de salida</Text>
                                        <Text style={{ fontSize: 15, color: '#ccc', fontWeight: 'bold', marginLeft: 10 }}>{moment(horas.hora_fin).format('HH:mm:ss')}</Text>
                                    </View>
                                </View>
                                <View style={{ alignContent: 'center', justifyContent: 'center', marginTop: 20 }}>
                                    <Text style={{ fontSize: 23, color: '#ccc', fontWeight: 'bold' }}>
                                        Que tengas un buen dia
                                    </Text>
                                </View>
                            </View>
                        }
                    </View>
                }

            </View>
        </EmpleadoLayout >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    containerHora: {
        borderWidth: 2,
        borderColor: '#B7B7B7',
        borderRadius: 100,
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    fechaContainer: {
        backgroundColor: '#3A4149',
        borderWidth: 1,
        borderColor: '#3A4149',
        flexDirection: 'row',
        borderRadius: 20,
        padding: 10,
        marginTop: 30,
        gap: 10,
        justifyContent: 'center',
    },
    horaContainer: {
        backgroundColor: '#3A4149',
        borderWidth: 1,
        borderColor: '#3A4149',
        flexDirection: 'row',
        borderRadius: 15,
        padding: 10,
        marginTop: 30,
        gap: 10,
        height: 60,
        width: "80%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 15,
        padding: 10,
        marginTop: 20,
        gap: 10,
        height: 60,
        width: "80%",
        alignItems: 'center',
        justifyContent: 'center',
    }
});