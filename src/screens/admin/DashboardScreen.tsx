import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { View, Dimensions, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import useVentas from '../../hooks/useVentas'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import VentasService from '../../services/VentasService';
import { showMessage } from "react-native-flash-message";

export default function DashboardScreen() {

    const anoActual = moment().format('YYYY');
    const mesActual = moment().format('M');
    const [ano, setAno] = useState(anoActual);
    const [mes, setMes] = useState(mesActual);
    const [tipoReporte, setTipoReporte] = useState('');

    const handleAnoChange = (itemValue) => {
        setAno(itemValue);
    };

    const handleMesChange = (itemValue) => {
        setMes(itemValue);
    };


    const screenWidth = Dimensions.get("window").width;

    const chartConfig = {
        backgroundGradientFrom: "#2B3035",
        backgroundGradientTo: "#2B3035",
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        propsForDots: {
            r: "1",
            strokeWidth: "1",
            stroke: "#007AFF"
        }
    };

    // Información de ventas
    const { data: productos, loading, error, refetch: refetchVentas } = useVentas("productosMasVendidos", { year: ano, month: mes });
    const { data: ventasMensuales, refetch: refetchVentasMensuales } = useVentas("ventasMensuales", { ano: ano, mes: mes });

    // Información de productos vendidos por mes

    const mesInt = parseInt(mes);
    const anoInt = parseInt(ano);
    const mesAnterior = mesInt - 1 <= 0 ? 12 : mesInt - 1;
    const anoAnterior = mesInt - 1 <= 0 ? anoInt - 1 : anoInt;

    const { data: cuentaProductosVendidosPorMes, loading: loadingCuentaProductosVendidosPorMes, error: errorCuentaProductosVendidosPorMes, refetch: refetchCuentaProductosVendidosPorMes } = useVentas("cuentaProductosVendidosPorMes", { ano: anoInt, mes: mesInt });

    const { data: cuentaProductosVendidosPorMesAnterior, loading: loadingCuentaProductosVendidosPorMesAnterior, error: errorCuentaProductosVendidosPorMesAnterior, refetch: refetchCuentaProductosVendidosPorMesAnterior } = useVentas("cuentaProductosVendidosPorMes", { ano: `${anoAnterior}`, mes: `${mesAnterior}` });

    const porcentajeProductos = (Math.floor(((cuentaProductosVendidosPorMes - cuentaProductosVendidosPorMesAnterior) / cuentaProductosVendidosPorMes) * 100));

    // Información total de ventas por mes

    const { data: cuentaVentasMes, loading: loadingCuentaVentasMes, error: errorCuentaVentasMes, refetch: refetchCuentaVentasMes } = useVentas("cuentaVentasMes", { ano: anoInt, mes: mesInt });

    const { data: cuentaVentasMesAnterior, loading: loadingCuentaVentasMesAnterior, error: errorCuentaVentasMesAnterior, refetch: refetchCuentaVentasMesAnterior } = useVentas("cuentaVentasMes", { ano: `${anoAnterior}`, mes: `${mesAnterior}` });

    const porcentajeVentas = (Math.floor(((cuentaVentasMes - cuentaVentasMesAnterior) / cuentaVentasMes) * 100));

    const [IA, setIA] = useState('');

    const diasMes = [];
    for (let dia = 1; dia <= moment(`${ano}-${mes}-01`, "YYYY-MM").daysInMonth(); dia++) {
        diasMes.push(dia);
    }

    const ventasDiarias = diasMes.map(dia => {
        const venta = ventasMensuales.find(venta => venta.dia == dia);
        return {
            dia: dia,
            total_ventas: venta ? venta.total_ventas : 0
        };
    });

    const dataGrafica = {
        labels: ventasDiarias.map(venta =>
            [1, 5, 10, 15, 20, 25, 30].includes(venta.dia) ? `${venta.dia}` : ''
        ),
        datasets: [{
            data: ventasDiarias.map(venta => venta.total_ventas),
        }]
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    }

    const handleDescargarPDF = async () => {
        try {
            if (!tipoReporte) return;

            Alert.alert(
                "Opciones de Reporte",
                "¿Qué deseas hacer con el reporte?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Solo Guardar",
                        onPress: async () => {
                            try {
                                await VentasService.getReportePDF(tipoReporte, ano, mes, 'guardar');
                                setTipoReporte('');
                            } catch (error) {
                                console.error('Error:', error);
                                showMessage({
                                    message: 'Error al guardar el PDF',
                                    type: 'danger',
                                    duration: 3000
                                });
                            }
                        }
                    },
                    {
                        text: "Guardar y Compartir",
                        onPress: async () => {
                            try {
                                await VentasService.getReportePDF(tipoReporte, ano, mes, 'compartir');
                                setTipoReporte('');
                            } catch (error) {
                                console.error('Error:', error);
                                showMessage({
                                    message: 'Error al compartir el PDF',
                                    type: 'danger',
                                    duration: 3000
                                });
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Error al descargar el PDF:', error);
            showMessage({
                message: 'Error al procesar el reporte',
                type: 'danger',
                duration: 3000
            });
        }
    };

    const [loadingIA, setLoadingIA] = useState(false);

    const handleIA = async () => {
        try {
            setLoadingIA(true);
            const response = await VentasService.getIA(tipoReporte, ano, mes);
            setIA(response);
            setLoadingIA(false);
            setTipoReporte('');
        }
        catch (error) {
            console.error('Error al generar el reporte con IA:', error);
            showMessage({
                message: 'Error al generar el reporte con IA',
                type: 'danger',
                duration: 3000
            });
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetchVentas();
                await refetchVentasMensuales();
                await refetchCuentaProductosVendidosPorMes();
                await refetchCuentaVentasMes();
                await refetchCuentaProductosVendidosPorMesAnterior();
                await refetchCuentaVentasMesAnterior();
            }
            catch (error) {
                console.error('Error al obtener datos:', error);
            }
        }
        fetchData();
    }, [ano, mes]);

    return (
        <AdminLayout>
            <View>
                <Text style={globalStyles.title}>Dashboard</Text>
                <View style={styles.pickerContainer}>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={ano}
                            onValueChange={handleAnoChange}
                            style={globalStyles.picker}
                            dropdownIconColor="#fff"
                            itemStyle={styles.pickerItem}
                            mode={Platform.OS === 'android' ? 'dialog' : null}
                        >
                            {[0, 1, 2, 3, 4].map(offset => {
                                const yearOption = parseInt(anoActual) - offset;
                                return <Picker.Item key={yearOption} label={`${yearOption}`} value={`${yearOption}`} />;
                            })}
                        </Picker>
                    </View>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={mes}
                            onValueChange={handleMesChange}
                            style={globalStyles.picker}
                            dropdownIconColor="#fff"
                            itemStyle={styles.pickerItem}
                            mode={Platform.OS === 'android' ? 'dialog' : null}
                        >
                            {[
                                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                            ].map((mesNombre, index) => (
                                <Picker.Item key={index + 1} label={mesNombre} value={`${index + 1}`} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 24 }}>
                    <Picker
                        selectedValue={tipoReporte}
                        onValueChange={value => setTipoReporte(value)}
                        style={Platform.OS === 'ios' ? globalStyles.pickerIOS : globalStyles.picker}
                        dropdownIconColor="#fff"
                        itemStyle={styles.pickerItem}
                        mode={Platform.OS === 'android' ? 'dialog' : null}
                    >
                        <Picker.Item label="Tipo de reporte" value="" enabled={false} />
                        <Picker.Item label="Mensual" value="mensual" />
                        <Picker.Item label="Anual" value="anual" />
                    </Picker>
                </View>
                <View style={{ marginVertical: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'center', gap: 30 }}>
                    <TouchableOpacity
                        onPress={handleDescargarPDF}
                        disabled={tipoReporte === ''}
                        style={{
                            backgroundColor: '#DC3545',
                            padding: 8,
                            borderRadius: 8,
                            opacity: tipoReporte === '' ? 0.5 : 1,
                        }}
                    >
                        <Ionicons name="document-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleIA}
                        disabled={tipoReporte === ''}
                        style={{
                            backgroundColor: '#0B5ED7',
                            padding: 8,
                            borderRadius: 8,
                            opacity: tipoReporte === '' ? 0.5 : 1,
                        }}
                    >
                        {loadingIA ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons style={{ color: '#fff' }} name="color-wand-outline" size={24} color="black" />}
                    </TouchableOpacity>
                </View>
                <View>
                    {loadingIA ? <ActivityIndicator size="large" color="#fff" /> : IA && <Text style={{ color: '#fff', paddingHorizontal: 24, fontSize: 15, marginVertical: 16 }}>{IA}</Text>}
                </View>
                <LineChart
                    data={dataGrafica}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    style={{ marginVertical: 8, borderRadius: 16, paddingHorizontal: 16 }}
                />
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.titulo_col}>Productos vendidos por mes</Text>
                        {
                            cuentaProductosVendidosPorMes.length == 0 ?
                                <View style={{ alignItems: "center" }}>
                                    <Text style={styles.titulo_col_naranja}>0 unidades</Text>
                                    <Text style={[styles.titulo_col, { textAlign: 'center' }]}>No hay productos vendidos este mes</Text>
                                </View>
                                :
                                <View style={{ alignItems: "center" }}>
                                    <Text style={styles.titulo_col}>{cuentaProductosVendidosPorMes}</Text>
                                    <Text style={[porcentajeProductos < 0 ? styles.porcentaje_negativo : styles.porcentaje_positivo]}>{porcentajeProductos}% este mes</Text>
                                </View>
                        }
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.titulo_col}>Total ventas por mes</Text>
                        {
                            cuentaVentasMes.length == 0 ?
                                <View style={{ alignItems: "center" }}>
                                    <Text style={styles.titulo_col_naranja}>$0</Text>
                                    <Text style={styles.titulo_col}>No hay ventas este mes</Text>
                                </View>
                                :
                                <View style={{ alignItems: "center" }}>
                                    <Text style={styles.titulo_col}>{formatCurrency(cuentaVentasMes)}</Text>
                                    <Text style={[porcentajeVentas < 0 ? styles.porcentaje_negativo : styles.porcentaje_positivo]}>{porcentajeVentas}% este mes</Text>
                                </View>
                        }
                    </View>
                    <View style={styles.col_2}>
                        <Text style={styles.titulo_col}>Productos más vendidos</Text>
                        {productos.length === 0 ? (
                            <Text style={{
                                color: "#ccc", fontSize: 18, textAlign: "center",
                                paddingVertical: 50
                            }}>No hay productos vendidos este mes</Text>
                        ) : (
                            <FlatList
                                data={productos}
                                keyExtractor={(item, index) => `${item.pro_nom}-${index}`}
                                horizontal={true}
                                style={{ width: "100%" }}
                                renderItem={({ item: producto }) => (
                                    <View style={styles.cartasContainer}>
                                        <View style={styles.cartas}>
                                            <Image source={{ uri: producto.pro_foto }} style={styles.imgCartas} />
                                            <Text style={styles.textCartas}>{producto.pro_nom}</Text>
                                        </View>
                                        <View style={styles.flame}>
                                            <Ionicons name="flame" size={24} color="black" style={{ color: "orange" }} />
                                            <Text style={styles.textCartas}>{producto.cantidad_vendida}</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </View>
        </AdminLayout >
    );
}

const styles = StyleSheet.create({
    row: {
        gap: 20,
        padding: 20,
    },
    col: {
        textAlign: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#6C757D",
        padding: 30,
    },
    col_2: {
        width: "100%",
        textAlign: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#6C757D",
        padding: 30,
    },
    titulo_col: {
        fontSize: 20,
        color: "#fff"
    },
    titulo_col_naranja: {
        fontSize: 20,
        color: "#FFC107"
    },
    subtitulo_col: {
        fontSize: 20,
        color: "#fff"
    },
    porcentaje_positivo: {
        fontSize: 20,
        color: "green"
    },
    porcentaje_negativo: {
        fontSize: 20,
        color: "red"
    },
    cartasContainer: {
        display: 'flex',
        marginTop: 6,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 6,
        width: 100
    },
    cartas: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: 20
    },
    imgCartas: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    textCartas: {
        color: '#fff',
        paddingTop: 6,
        fontWeight: 'bold',

    },
    precioCartas: {
        color: '#FFC107',
        paddingTop: 4
    },
    flame: {
        backgroundColor: "#2B3035",
        borderRadius: 10,
        position: "absolute",
        top: 10,
        right: -15,
        display: "flex",
        flexDirection: "row",
        gap: 5
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 10
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: '#2B3035',
        borderRadius: 8,
        overflow: 'hidden',
    },

    pickerItem: {
        color: '#fff',
        fontSize: Platform.OS === 'ios' ? 16 : 14,
    },
    IA: {
        padding: 30,
        color: "#fff"
    },

});
