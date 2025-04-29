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
    static async getRecompensasObtenidasUsuario() {
        try {
            const response = await RecompensasRepository.getRecompensasObtenidasUsuario();
            return response || null;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getPuntosUsuario() {
        try {
            const response = await RecompensasRepository.getPuntosUsuario();
            return response || null;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async reclamar (id) {
        try {
            const response = await RecompensasRepository.reclamar(id);
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
    static async restaurarRecompensa(id) {
        try {
            const response = await RecompensasRepository.restaurarRecompensa(id);
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