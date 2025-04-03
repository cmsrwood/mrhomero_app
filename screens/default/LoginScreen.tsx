import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import useAuth from "../../hooks/useAuth";
import globalStyles from "../../styles/globalStyles";
import DefaultLayout from "../../components/DefaultLayout";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { login } = useAuth()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isFocused, setIsFocused] = useState(null);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Ingrese correo y contraseña");
            return;
        }
        await login(email, password);
    };

    return (
        <DefaultLayout>
            <View style={globalStyles.container}>
                <View style={{ paddingVertical: 20 }}>
                    <Text style={globalStyles.title}>Iniciar Sesión</Text>
                </View>
                <View style={styles.form}>
                    <Ionicons name="person-circle" style={styles.icon}></Ionicons>
                    <TextInput style={[styles.input, isFocused === "email" && styles.inputFocused]}
                        placeholder="Correo"
                        placeholderTextColor="#ccc"
                        onChangeText={setEmail}
                        value={email}
                        onFocus={() => setIsFocused("email")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "password" && styles.inputFocused]}
                        placeholder="Contraseña"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        onChangeText={setPassword}
                        value={password}
                        onFocus={() => setIsFocused("password")}
                        onBlur={() => setIsFocused(null)} />
                </View>
                <View style={styles.flex}>
                    <TouchableOpacity>
                        <Text style={styles.forgot}>Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleLogin} style={[globalStyles.button, { width: "60%", alignSelf: "center", marginTop: 20 }]}>
                    <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("RegistrarScreen")}>
                    <Text style={styles.registrate}>¿No tienes cuenta? Registrate</Text>
                </TouchableOpacity>
            </View>
        </DefaultLayout>
    );
}

const styles = StyleSheet.create({
    img: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        height: 40,
        width: '100%',
        borderRadius: 15,
        padding: 10,
        color: "#fff"
    },
    inputFocused: {
        borderColor: '#FFC107',
    },
    flex: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    form: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    forgot: {
        fontSize: 12,
        paddingBottom: 20,
        paddingTop: 10,
        color: "#ccc",
    },
    registrate: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 25,
        color: "#ccc",
    },
    button: {
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: "#FFD700",
        borderRadius: 15,
        height: 40,
        width: '40%',
    },
    icon: {
        fontSize: 100,
        color: "#ccc",
    }

});