import React, { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { View, Dimensions, Text, StyleSheet, FlatList, Image } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import useVentas from '../../hooks/useVentas'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

export default function Dashboard() {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    }

    const screenWidth = Dimensions.get("window").width;

    const data = {
        labels: ["Ene", "Feb", "Mar", "Abr", "May"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99]
            }
        ]
    };

    const chartConfig = {
        backgroundGradientFrom: "#2B3035",
        backgroundGradientTo: "#2B3035",
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#007AFF"
        }
    };

    const { data: productos } = useVentas("productosMasVendidos", { year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

    const [ano, setAno] = useState(new Date().getFullYear());
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ia, setIA] = useState('');

    const handleAnoChange = (event) => {
        setAno(event.target.value);
        setIA('');
        const collapseElement = document.getElementById('CollapseIA');
        collapseElement.classList.remove('show');
    };

    const handleMesChange = (event) => {
        setMes(event.target.value);
        const collapseElement = document.getElementById('CollapseIA');
        collapseElement.classList.remove('show');
        setIA('');
    };

    const diasMes = [];
    for (let dia = 1; dia <= moment(`${ano}-${mes}-01`, "YYYY-MM").daysInMonth(); dia++) {
        diasMes.push(dia);
    }

    return (
        <AdminLayout>
            <View>
                <LineChart
                    data={data}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    style={{ marginHorizontal: 16, marginVertical: 8, borderRadius: 16 }}
                />
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.titulo_col}>Productos vendidos por mes</Text>
                        <Text style={styles.subtitulo_col}>69 Unidades</Text>
                        <Text style={styles.porcentaje_positivo}>+x este mes</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.titulo_col}>Total ventas por mes</Text>
                        <Text style={styles.subtitulo_col}>{formatCurrency(10000)}</Text>
                        <Text style={styles.porcentaje_negativo}>+x este mes</Text>
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
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        position: "absolute",
        top: 10,
        right: -15,
        display: "flex",
        flexDirection: "row",
        gap: 5
    }
});
