import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthRepository from "../repositories/AuthRepository";

const AuthService = {
    login: async (email, password) => {
        const data = await AuthRepository.login(email, password);
        await AsyncStorage.setItem("token", data.token);
        return data;
    },

    logout: async () => {
        await AsyncStorage.removeItem("token");
    },

    validarToken: async () => {
        try {
            return await AuthRepository.validarToken();
        } catch {
            return null;
        }
    },

    getToken: async () => {
        return await AsyncStorage.getItem("token");
    }
};

export default AuthService;