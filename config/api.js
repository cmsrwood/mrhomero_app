import axios from "axios";
import AuthService from "../services/AuthService";
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseURL = () => {
    if (process.env.BACKEND_URL) {
        return process.env.BACKEND_URL;
    }

    if (Platform.OS === 'web') {
        return 'http://localhost:4400/api';
    }

    if (Constants.expoConfig?.hostUri) {
        const ip = Constants.expoConfig.hostUri.split(':')[0];
        return `http://${ip}:4400/api`;
    }

    return 'http://localhost:4400/api';
};

const API = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
});

API.interceptors.request.use(async (config) => {
    const token = await AuthService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;