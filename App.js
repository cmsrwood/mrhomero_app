import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth, AuthProvider } from "./context/AuthProvider";
import { View, Text, ActivityIndicator } from "react-native";

const PublicScreen = () => <View><Text>Pantalla Pública</Text></View>;
const PrivateScreen = () => <View><Text>Pantalla Privada</Text></View>;
const LoginScreen = () => <View><Text>Login</Text></View>;

const Stack = createNativeStackNavigator();

const PublicStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
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
