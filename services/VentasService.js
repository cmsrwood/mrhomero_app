import VentasRepository from "../repositories/VentasRepository";

class VentasService {
    static async getVentas() {
        try {
            const data = await VentasRepository.getVentas();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async getProductosMasVendidos(year, month) {
        try {
            const data = await VentasRepository.getProductosMasVendidos(year, month);
            if (!data) return [];
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default VentasService;   