import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "./contexts/AuthContext";
import useAuth from "./hooks/useAuth";
import AdminNavigator from "./navigation/AdminNavigator";
import EmpleadoNavigator from "./navigation/EmpleadoNavigator";
import ClienteNavigator from "./navigation/ClienteNavigator";
import PublicNavigator from "./navigation/PublicNavigator";
import Loader from "./components/Loader";

export default function App() {
  return (
    <AuthContext>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthContext>
  );
}

function MainNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (!user) return <PublicNavigator />;

  switch (user.rol) {
    case 1:
      return <AdminNavigator />;
    case 2:
      return <EmpleadoNavigator />;
    case 3:
      return <ClienteNavigator />;
    default:
      return <PublicNavigator />;
  }
}
