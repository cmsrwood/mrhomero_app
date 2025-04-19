import RecompensasRepository from "../repositories/RecompensasRepository";

class RecompensasService {
    static async getRecompensas() {
        try {
            const response = await RecompensasRepository.getRecompensas();
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getRecompensa(id) {
        try {
            const response = await RecompensasRepository.getRecompensa(id);
            return response || null;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async crearRecompensa(data) {
        try {
            const response = await RecompensasRepository.crearRecompensa(data);
            return response || null;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async actualizarRecompensa(id, data) {
        try {
            const response = await RecompensasRepository.actualizarRecompensa(id, data);
            return response || null;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async eliminarRecompensa(id) {
        try {
            const response = await RecompensasRepository.eliminarRecompensa(id);
            return response || null;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default RecompensasService;