import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import useAuth from "../../hooks/useAuth";

export default function LoginScreen() {
    const { login } = useAuth()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Ingrese correo y contraseña");
            return;
        }
        await login(email, password);
    };

    return (
        <View>
            <Text>Iniciar Sesión</Text>
            <TextInput placeholder="Correo" onChangeText={setEmail} value={email} />
            <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} value={password} />
            <Button title="Ingresar" onPress={handleLogin} />
        </View>
    );
}