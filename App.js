import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Hello Muñoz</Text>
    <Button title="Ir a Detalles" onPress={() => navigation.navigate('Details')} />
    <StatusBar style="auto" />
  </View>
);

const DetailsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>bye Muñoz</Text>
    <Button title="Volver" onPress={() => navigation.goBack()} />
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalles' }} />
      </Stack.Navigator>
    </NavigationContainer>
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
