import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
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

            return data.map(producto => ({
                id: producto.id_producto,
                nombre: producto.pro_nom,
                foto: producto.pro_foto,
                cantidad: producto.cantidad_vendida
            }))
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default VentasService;   