import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import globalStyles from "../../styles/globalStyles";
import DefaultLayout from "../../components/DefaultLayout";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import AuthService from "../../services/AuthService";
import { showMessage } from "react-native-flash-message";

export default function RecuperarEmailScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [isFocused, setIsFocused] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!email) {
            const msg = "Ingresa un correo";
            setError(msg);
            showMessage({
                message: "Error",
                description: msg,
                type: "warning",
                icon: "warning",
            });
            return;
        }
        try {
            const response = await AuthService.recuperar(email);
            showMessage({
                message: "Codigo enviado",
                description: response.message,
                type: "success",
                icon: "success",
                duration: 2000
            })
            navigation.navigate("RecuperarScreen", { email });
            setError('');
        } catch (error) {
            setError("Error al enviar codigo");
            showMessage({
                message: "Error al enviar codigo",
                description: error.message,
                type: "danger",
                icon: "danger",
            })
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