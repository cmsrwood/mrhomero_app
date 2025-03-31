import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../../context/AuthProvider';

const loginSchema = Yup.object().shape({
    email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});

export default function LoginScreen() {
    const { login } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };
    const alerta = () => {
        Alert.alert(
            "Hola"
        )
    }
    alerta();
    return (
        <View>
            <View style={styles.container}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize='none'
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                <Button title="Ingresar" onPress={handleSubmit(onSubmit)}  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    ingresar: {
        marginTop: 20,
        backgroundColor: '#FFC107',
    },
})