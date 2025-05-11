import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/AuthContext";
import useAuth from "./src/hooks/useAuth";
import AdminNavigator from "./src/navigation/AdminNavigator";
import EmpleadoNavigator from "./src/navigation/EmpleadoNavigator";
import ClienteNavigator from "./src/navigation/ClienteNavigator";
import PublicNavigator from "./src/navigation/PublicNavigator";
import Loader from "./src/components/Loader";
import { useFonts } from 'expo-font';
import FlashMessage from "react-native-flash-message";
import Constants from "expo-constants";

export default function App() {

  const [fontsLoaded] = useFonts({
    "Homer-Simpson": require("./src/assets/font/Homer_Simpson.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <FlashMessage
          position="top"
          style={{
            paddingTop: Constants.statusBarHeight,
            zIndex: 999,
            elevation: 3,
          }}
          titleStyle={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
          }}
          textStyle={{
            fontSize: 14,
            color: 'white',
          }}
        />
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function MainNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (!user) return <PublicNavigator />;

  switch (user.rol) {
    case 1:
      return <AdminNavigator />
    case 2:
      return <EmpleadoNavigator />;
    case 3:
      return <ClienteNavigator />;
    default:
      return <PublicNavigator />;
  }
}
