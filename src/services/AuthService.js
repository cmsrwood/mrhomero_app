import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthRepository from "../repositories/AuthRepository";

class AuthService {
    static async login(email, password) {
        try {
            const data = await AuthRepository.login(email, password);
            if (data?.token) {
                await AsyncStorage.setItem("token", data.token);
                return data;
            }
            throw new Error("No se recibió un token válido.");
        } catch (error) {
            throw error;
        }
    }

    static async validarToken() {
        try {
            return await AuthRepository.validarToken();
        } catch (error) {
            console.warn("Token inválido o expirado.");
            return null;
        }
    }

    static async getToken() {
        try {
            const token = await AsyncStorage.getItem("token");
            return token || null;
        } catch (error) {
            return null;
        }
    }

    static async registrar(user) {
        try {
            const response = await AuthRepository.registrar(user);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al registrar el usuario.";
            throw new Error(errorMessage);
        }
    }
    static async recuperar(email) {
        try {
            const response = await AuthRepository.recuperar(email);
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async resetPassword(email, newPassword, verificationCode) {
        try {
            const response = await AuthRepository.resetPassword(email, newPassword, verificationCode);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default AuthService;
