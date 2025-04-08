import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import AdminLayout from '../../components/AdminLayout';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [
            {
                data: [20, 45, 28, 80, 99]
            }
        ]
    };

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.6
    };

    return (
        <AdminLayout>
            <LineChart
                data={data}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                style={{ marginVertical: 8, borderRadius: 16, marginHorizontal: 16 }}
            />
        </AdminLayout>
    );
};