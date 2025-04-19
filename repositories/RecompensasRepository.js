import API from "../config/api";

class RecompensasRepository {
    static async getRecompensas() {
        const response = await API.get("/tienda/recompensas");
        return response.data
    }
    static async getRecompensa(id) {
        const response = await API.get(`/tienda/recompensa/${id}`);
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
    static async eliminarRecompensa(id) {
        const response = await API.put(`/tienda/recompensas/eliminar/${id}`);
        return response
    }
}

export default RecompensasRepository;