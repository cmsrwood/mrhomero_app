import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import AuthService from "../../services/AuthService";
import mrhomeroImg from "../../assets/favicon.png";
import globalStyles from "../../styles/globalStyles";
import DefaultLayout from "../../components/DefaultLayout"
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";


export default function RegistrarScreen() {
    const navigation = useNavigation();
    const { registrar } = AuthService;

    const [error, setError] = useState('');

    const [user, setUser] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isFocused, setIsFocused] = useState('');

    const handleChange = (data) => (value) => {
        setUser({ ...user, [data]: value });
    };

    const handleRegister = async () => {
        if (!user.nombres || !user.apellidos || !user.email || !user.password || !user.confirmPassword) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (user.password !== user.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const nombreConGuiones = user.nombres.replace(/\s+/g, "_");
        const id_unico = `user_${nombreConGuiones}_${Date.now()}_app`;

        const data = {
            id: id_unico,
            nombres: user.nombres,
            apellidos: user.apellidos,
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword
        };

        try {
            const response = await registrar(data);

            showMessage({
                message: response.message || "Usuario registrado correctamente.",
                type: "success",
                icon: "success",
                duration: 3000,
            });

            navigation.navigate("LoginScreen"); 
        } catch (error) {
            showMessage({
                message: error.message || "Hubo un problema al registrar.",
                description: "Por favor, intenta nuevamente.",
                type: "danger",
                icon: "danger",
                duration: 3000,
            });
        }
    };


    return (
        <DefaultLayout>
            <View style={globalStyles.container}>
                <View >
                    <Text style={globalStyles.title}>Registro</Text>
                </View>
                <View style={styles.form}>
                    <Ionicons name="people-circle" style={styles.icon}></Ionicons>
                    <TextInput style={[styles.input, isFocused === "nombres" && styles.focusedInput]}
                        placeholder="Nombres"
                        placeholderTextColor="#ccc"
                        onChangeText={handleChange("nombres")}
                        value={user.nombres}
                        onFocus={() => setIsFocused("nombres")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "apellidos" && styles.focusedInput]}
                        placeholder="Apellidos"
                        placeholderTextColor="#ccc"
                        onChangeText={handleChange("apellidos")}
                        value={user.apellidos}
                        onFocus={() => setIsFocused("apellidos")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "email" && styles.focusedInput]}
                        placeholder="Correo"
                        placeholderTextColor="#ccc"
                        onChangeText={handleChange("email")}
                        value={user.email}
                        onFocus={() => setIsFocused("email")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "password" && styles.focusedInput]}
                        placeholder="Contraseña"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        onChangeText={handleChange("password")}
                        value={user.password}
                        onFocus={() => setIsFocused("password")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "confirmPassword" && styles.focusedInput]}
                        placeholder="Confirmar Contraseña"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        onChangeText={handleChange("confirmPassword")}
                        value={user.confirmPassword}
                        onFocus={() => setIsFocused("confirmPassword")}
                        onBlur={() => setIsFocused(null)} />
                </View>
                <Text style={[globalStyles.error, { textAlign: "center", marginTop: 10 }]}>{error}</Text>
                <TouchableOpacity onPress={handleRegister} style={[globalStyles.button, { width: "60%", alignSelf: "center", marginTop: 15 }]}>
                    <Text style={globalStyles.buttonText}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                    <Text style={styles.iniciasesion}>¿Ya tienes una cuenta? Inicia Sesión</Text>
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
        alignSelf: "center"
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
    focusedInput: {
        borderColor: "#FFC107",
        color: "#FFC107"
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
        marginTop: 20
    },
    forgot: {
        fontSize: 12,
        paddingBottom: 20,
        paddingLeft: 15
    },
    iniciasesion: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 20,
        color: "#ccc"
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
        color: "#ccc"
    }
});