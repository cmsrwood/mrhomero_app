import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import useEmpleados from '../../hooks/useEmpleados'
import globalStyles from '../../styles/globalStyles'
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'


export default function GestionHorasScreen({ route }) {

    const { id } = route.params
    const { data: empleado, loading: loadingEmpleados, error: errorEmpleados, refetch: refetchEmpleados } = useEmpleados('Empleado', { id_empleado: id });


    const anoActual = new Date().getFullYear();
    const anoInicio = 2024;

    const anos = Array.from({ length: (anoActual - anoInicio + 1) }, (_, i) => anoInicio + i);

    const meses = [
        { label: 'Enero', value: 1 },
        { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 },
        { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 },
        { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 },
        { label: 'Diciembre', value: 12 },
    ];

    const [ano, setAno] = useState(anoActual);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [horasEsperdas, setHorasEsperdas] = useState(230);
    const [horasExtra, setHorasExtra] = useState(0);

    const { data: horasTrabajadas, loading: loadingHorasTrabajadas, error: errorHorasTrabajadas, refetch: refetchHorasTrabajadas } = useEmpleados('HorasTrabajadasPorMes', { id_empleado: id, mes: mes, ano: ano });
    const { data: diasTrabajados, loading: loadingDiasTrabajados, error: errorDiasTrabajados, refetch: refetchDiasTrabajados } = useEmpleados('DiasTrabajados', { id_empleado: id, mes: mes, ano: ano });

    useEffect(() => {
        refetchEmpleados();
        refetchHorasTrabajadas();
        refetchDiasTrabajados();
        setHorasExtra(horasTrabajadas?.[0]?.horas - horasEsperdas)
    }, [mes, ano]);


        function diaEspanol(dia) {
        switch (dia) {
            case 'Monday':
                return 'Lunes';
            case 'Tuesday':
                return 'Martes';
            case 'Wednesday':
                return 'Miercoles';
            case 'Thursday':
                return 'Jueves';
            case 'Friday':
                return 'Viernes';
            case 'Saturday':
                return 'Sabado';
            case 'Sunday':
                return 'Domingo';
            default:
                return dia;
        }
    }


    return (
        <AdminLayout>
            <View style={styles.container} >
                <Text style={[globalStyles.title, { fontSize: 42, marginTop: 20, maxWidth: 300 }]}> Horas de {empleado.user_nom}</Text>
                <View>
                    <Image style={styles.imageEmpleado} source={{ uri: empleado.user_foto }}></Image>
                    <Text style={styles.nameEmpleado}>{empleado.user_nom} {empleado.user_apels}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                        <Picker
                            style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                            selectedValue={ano}
                            onValueChange={(itemValue) => setAno(itemValue)}
                        >
                            {anos.map((y) => (
                                <Picker.Item key={y} label={y.toString()} value={y} />
                            ))}

                        </Picker>
                        <Picker
                            style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                            selectedValue={mes}
                            onValueChange={(value) => setMes(value)}
                        >
                            {meses.map((m) => (
                                <Picker.Item key={m.value} label={m.label} value={m.value} />
                            ))}

                        </Picker>
                    </View>

                    <View style={styles.horasContainer}>
                        <View style={styles.horaContent}>
                            <View style={{ flexDirection: 'row', gap: 5 }} >
                                <Ionicons name="time-outline" size={20} color="#3B82F6"></Ionicons>
                                <Text style={{ color: '#fff', marginBottom: 5, fontSize: 12, }}>Esperadas</Text>
                            </View>
                            <Text style={{ color: '#fff', marginBottom: 5, fontSize: 22, fontWeight: 'bold', alignSelf: 'flex-start' }}>{horasEsperdas} h</Text>
                        </View>
                        <View style={styles.horaContent}>
                            <View style={{ flexDirection: 'row', gap: 5 }} >
                                <Ionicons name="time-outline" size={20} color="#10B981"></Ionicons>
                                <Text style={{ color: '#fff', marginBottom: 5, fontSize: 12 }}>registradas</Text>
                            </View>
                            <Text style={{ color: '#fff', marginBottom: 5, fontSize: 22, fontWeight: 'bold', alignSelf: 'flex-start' }}>  {horasTrabajadas?.[0]?.horas ? horasTrabajadas?.[0]?.horas : 0} h</Text>
                        </View>
                        <View style={styles.horaContent}>
                            <View style={{ flexDirection: 'row', gap: 5 }} >
                                <Ionicons name="time-outline" size={20} color="#FBBF24"></Ionicons>
                                <Text style={{ color: '#fff', marginBottom: 5, fontSize: 12 }}>Extra</Text>
                            </View>
                            <Text style={{ color: '#fff', marginBottom: 5, fontSize: 22, fontWeight: 'bold', alignSelf: 'flex-start' }}>{horasExtra > 0 ? horasExtra : 0} h</Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.column}>
                            <View style={styles.headerTable}>
                                <Text style={{ color: '#fff', marginBottom: 5, fontSize: 15, fontWeight: 'bold' }}>Dia</Text>
                                <Text style={{ color: '#fff', marginBottom: 5, fontSize: 15, fontWeight: 'bold' }}>Fecha</Text>
                                <Text style={{ color: '#fff', marginBottom: 5, fontSize: 15, fontWeight: 'bold' }}>Inicio</Text>
                                <Text style={{ color: '#fff', marginBottom: 5, fontSize: 15, fontWeight: 'bold' }}>Fin</Text>
                            </View>

                            
                            {diasTrabajados.length === 0 ? <Text style={{ color: '#fff', marginBottom: 5, fontSize: 15, fontWeight: 'bold', margin: 10, textAlign: 'center' }}>No hay horas registradas en el mes seleccionado</Text> : null}
                            {diasTrabajados.map((dia) => (
                                <View style={styles.row} key={dia.fecha}>
                                    <Text style={{ color: '#fff' }}>{diaEspanol(moment(dia.fecha).format('dddd'))}</Text>
                                    <Text style={{ color: '#fff' }}>{moment(dia.fecha).format('DD-MM-YYYY')}</Text>
                                    <Text style={{ color: '#fff' }}>{moment(dia.hora_inicio).format('hh:mm:ss A')}</Text>
                                    <Text style={{ color: '#fff' }}>{moment(dia.hora_fin).format('hh:mm:ss A')}</Text>
                                </View>
                            ))}

                        </View>

                    </View>
                </View>
            </View>
        </AdminLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    imageEmpleado: {
        width: 120,
        height: 120,
        borderRadius: 200,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#FFC107',
        marginBottom: 13
    },
    nameEmpleado: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center'
    },
    picker: {
        backgroundColor: '#2B3035',
        color: '#fff',
        width: 150,
        height: 50,
        marginVertical: 10,
    },
    pickerIOS: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        height: 50,
        marginVertical: 10
    },
    table: {
        alignItems: 'center',
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#BDC3C7',
        marginTop: 10,
        paddingBottom: 10,
        width: '100%',
        justifyContent: 'space-around'
    },
    column: {
        borderWidth: 1,
        borderColor: '#BDC3C7',
        borderRadius: 4,
        marginBottom: 10,
    },
    headerTable: {
        flexDirection: 'row',
        backgroundColor: '#4A5159',
        padding: 10,
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 25
    },
    horasContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 15,
        width: '100%'
    },
    horaContent: {
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#4A5159',
        padding: 10,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: '#BDC3C7',
        borderRadius: 4,
        width: '30%'
    }
});
