import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "./contexts/AuthContext";
import useAuth from "./hooks/useAuth";
import PrivateNavigator from "./navigation/PrivateNavigator";
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

  return user ? <PrivateNavigator /> : <PublicNavigator />;
}
