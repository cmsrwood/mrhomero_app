import API from "../config/api";
import AuthService from "../services/AuthService";

class RecompensasRepository {
    static async getRecompensas() {
        const response = await API.get("/tienda/recompensas");
        return response.data
    }
    static async getRecompensasObtenidasUsuario() {
        const token = await AuthService.getToken();
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const id = tokenData.id;
        const response = await API.get(`/tienda/recompensas/recompensasUsuario/${id}`);
        return response.data
    }

    static async getPuntosUsuario() {
        const token = await AuthService.getToken();
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const id = tokenData.id;
        const response = await API.get(`/tienda/recompensas/puntosUsuario/${id}`);
        return response.data[0].user_puntos
    }

    static async getRecompensa(id) {
        const response = await API.get(`/tienda/recompensas/${id}`);
        return response
    }
    static async reclamar(id) {
        const response = await API.post(`/tienda/recompensas/reclamar/${id}`);
        return response
    }
    static async crearRecompensa(data) {
        const response = await API.post("/tienda/recompensas/crear", data);
        return response
    }
    static async actualizarRecompensa(id, data) {
        const response = await API.put(`/tienda/recompensas/actualizar/${id}`, data);
        return response
    }
    static async restaurarRecompensa(id) {
        const response = await API.put(`/tienda/recompensas/restaurar/${id}`);
        return response
    }
    static async eliminarRecompensa(id) {
        const response = await API.put(`/tienda/recompensas/eliminar/${id}`);
        return response
    }
}

export default RecompensasRepository;