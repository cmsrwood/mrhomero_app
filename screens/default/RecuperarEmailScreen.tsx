import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import globalStyles from "../../styles/globalStyles";
import DefaultLayout from "../../components/DefaultLayout";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import AuthService from "../../services/AuthService";

export default function RecuperarEmailScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [isFocused, setIsFocused] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!email) {
            setError("Ingrese correo");
            return;
        }
        try {
            const response = await AuthService.recuperar(email);
            console.log(response);
            if (response.success) {
                alert("Codigo enviado");
                navigation.navigate("RecuperarScreen", { email });
                setError('');
            } else {
                alert(response.message);
                setError(response.message);
            }
        } catch (error) {
            console.error("Error al enviar codigo:", error.message);
        }
    };

    return (
        <DefaultLayout>
            <View style={globalStyles.container}>
                <View style={{ paddingVertical: 20 }}>
                    <Text style={globalStyles.title}>Recuperar Contraseña</Text>
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
                    <Text style={styles.error}>{error}</Text>
                </View>
                <TouchableOpacity onPress={handleSubmit} style={[globalStyles.button, { width: "60%", alignSelf: "center", marginTop: 20 }]}>
                    <Text style={globalStyles.buttonText}>Enviar Codigo</Text>
                </TouchableOpacity>
            </View>
        </DefaultLayout>
    );
}

const styles = StyleSheet.create({
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
    error: {
        color: "red",
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