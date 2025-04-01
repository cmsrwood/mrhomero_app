import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View, Button, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import homeroImg from '../../assets/favicon.png';

const loginSchema = Yup.object().shape({
    email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});

export default function LoginScreen() {
    const [isFocused, setIsFocused] = useState(null);
    const { login } = useAuth();
    const navigation = useNavigation();
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

    return (
        <View style={styles.container}>
            <Image source={homeroImg} style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', width: 200, height: 200 }}></Image>
            <View style={styles.form}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.inputEmail, isFocused == 'inputEmail' && styles.inputEmailFocused]}
                            placeholder="Email"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize='none'
                            onFocus={() => setIsFocused('inputEmail')}
                            onBlur={() => setIsFocused(null)}
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.inputPassword, isFocused == 'inputPassword' && styles.inputPasswordFocused]}
                            placeholder="Contraseña"
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                            onFocus={() => setIsFocused('inputPassword')}
                            onBlur={() => setIsFocused(null)}
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}


                {// Este boton es para recuperar la contraseña
                }
                <TouchableOpacity onPress={() => navigation.navigate("RecoverPassword")}>
                    <Text> ¿Olvidaste tu contraseña? </Text>
                </TouchableOpacity >

                {//Este boton sirve para ingresar al sistema 
                }
                <TouchableOpacity style={styles.ingresar} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity >
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: Constants.statusBarHeight
    },
    form: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 40
    },
    inputEmail: {
        height: 40,
        width: '90%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
    },

    inputEmailFocused: {
        borderColor: '#FFC107',
    },
    inputPassword: {
        height: 40,
        width: '90%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
    },

    inputPasswordFocused: {
        borderColor: '#FFC107',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    ingresar: {
        marginTop: 20,
        backgroundColor: '#FFC107',
        borderRadius: 15,
        height: 40,
        width: '25%',
        alignItems: 'center',
    },
    buttonText: {
        padding: 10
    }
})