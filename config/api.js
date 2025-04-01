import axios from "axios";
import AuthService from "../services/AuthService";

const API = axios.create({
    baseURL: process.env.BACKEND_URL || "http://localhost:4400",
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