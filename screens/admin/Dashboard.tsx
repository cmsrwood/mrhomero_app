import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AdminLayout from '../../components/AdminLayout';
import { showMessage } from 'react-native-flash-message';

export default function Dashboard() {
    return (
        <AdminLayout>
            <View>
                <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10 }}>
                    Ventas Semanales
                </Text>
                <LineChart
                    data={{
                        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                        datasets: [
                            {
                                data: [20, 45, 28, 80, 99, 43],
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    chartConfig={{
                        backgroundColor: '#1E1E1E',
                        backgroundGradientFrom: '#1E1E1E',
                        backgroundGradientTo: '#333',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
                        labelColor: () => '#fff',
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#FFD700',
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 10,
                        borderRadius: 16,
                        alignSelf: 'center',
                    }}
                />
            </View>
        </AdminLayout>
    );
}
