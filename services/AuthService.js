import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthRepository from "../repositories/AuthRepository";

const AuthService = {
    login: async (email, password) => {
        try {
            const data = await AuthRepository.login(email, password);
            if (data?.token) {
                await AsyncStorage.setItem("token", data.token);
                return data;
            }
            throw new Error("No se recibió un token válido.");
        } catch (error) {
            console.error("Error en login:", error.message);
            throw error;
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem("token");
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
            throw error;
        }
    },

    validarToken: async () => {
        try {
            return await AuthRepository.validarToken();
        } catch (error) {
            console.warn("Token inválido o expirado.");
            return null;
        }
    },

    getToken: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            return token || null;
        } catch (error) {
            console.error("Error al obtener el token:", error.message);
            return null;
        }
    },

    registrar: async (user) => {
        try {
            const response = await AuthRepository.registrar(user);
            return response;
        } catch (error) {
            console.error("Error al registrar el usuario:", error.message);
            throw error;
        }
    },
    recuperar : async (email) => {
        try {
            const response = await AuthRepository.recuperar(email);
            return response;
        } catch (error) {
            console.error("Error al enviar codigo:", error.message);
            throw error;
        }
    },
};

export default AuthService;
