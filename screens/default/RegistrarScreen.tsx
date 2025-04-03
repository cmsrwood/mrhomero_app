import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import AuthService from "../../services/AuthService";
import mrhomeroImg from "../../assets/favicon.png";
import globalStyles from "../../styles/globalStyles";
import { FlatList, } from "react-native-gesture-handler";
import DefaultLayout from "../../components/DefaultLayout"
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function RegistrarScreen() {
    const navigation = useNavigation();
    const { registrar } = AuthService;

    const [user, setUser] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        password: "",
        confirmarPassword: "",
    });

    const [isFocused, setIsFocused] = useState('');

    const handleChange = () => {
        return (e) => {
            setUser({ ...user, [e.target.name]: e.target.value });
        };
    };

    const handleLogin = async () => {
        if (!user.email || !user.password || !user.confirmarPassword) {
            alert("Ingrese correo y contraseña");
            return;
        }
        await registrar(user);
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

                        onChangeText={handleChange()}
                        value={user.nombres}
                        onFocus={() => setIsFocused("nombres")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "apellidos" && styles.focusedInput]}
                        placeholder="Apellidos"
                        placeholderTextColor="#ccc"

                        onChangeText={handleChange()}
                        value={user.apellidos}
                        onFocus={() => setIsFocused("apellidos")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "email" && styles.focusedInput]}
                        placeholder="Correo"
                        placeholderTextColor="#ccc"

                        onChangeText={handleChange()}
                        value={user.email}
                        onFocus={() => setIsFocused("email")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "password" && styles.focusedInput]}
                        placeholder="Contraseña"
                        placeholderTextColor="#ccc"

                        onChangeText={handleChange()}
                        value={user.password}
                        onFocus={() => setIsFocused("password")}
                        onBlur={() => setIsFocused(null)} />
                    <TextInput style={[styles.input, isFocused === "confirmarPassword" && styles.focusedInput]}
                        placeholder="Confirmar Contraseña"
                        placeholderTextColor="#ccc"

                        onChangeText={handleChange()}
                        value={user.confirmarPassword}
                        onFocus={() => setIsFocused("confirmarPassword")}
                        onBlur={() => setIsFocused(null)} />
                </View>
                <TouchableOpacity onPress={handleLogin} style={[globalStyles.button, { width: "60%", alignSelf: "center", marginTop: 15 }]}>
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
        padding: 10
    },
    focusedInput: {
        borderColor: "#FFC107",
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