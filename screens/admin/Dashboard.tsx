import { LineChart } from 'react-native-chart-kit';
import { View, Dimensions } from 'react-native';
import AdminLayout from '../../components/AdminLayout';

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
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#007AFF"
    }
};

export default function Dashboard() {
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
            </View>
        </AdminLayout>
    );
}
