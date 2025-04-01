import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./contexts/AuthProvider";
import useAuth from "./hooks/useAuth";
import PrivateNavigator from "./navigation/PrivateNavigator";
import PublicNavigator from "./navigation/PublicNavigator";
import Loader from "./components/Loader";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function MainNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return user ? <PrivateNavigator /> : <PublicNavigator />;
}
