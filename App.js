import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth, AuthProvider } from "./context/AuthProvider";
import { View, Text, ActivityIndicator } from "react-native";
import LoginScreen from "./screens/default/LoginScreen";
import Recuperar from './screens/default/RecuperarScreen';


const PublicScreen = () => <View><Text>Pantalla Pública</Text></View>;
const PrivateScreen = () => <View><Text>Pantalla Privada</Text></View>;

const Stack = createNativeStackNavigator();

const PublicStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Mr.Homero" component={LoginScreen} />
    <Stack.Screen name="RecoverPassword" component={Recuperar}></Stack.Screen>
  </Stack.Navigator>
);

const PrivateStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={PrivateScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  const { token, loading } = useAuth();

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <NavigationContainer>
      {token ? <PrivateStack /> : <PublicStack />}
    </NavigationContainer>
  );
};

// Envolver la app con AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
