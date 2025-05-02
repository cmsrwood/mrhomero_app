import InventarioRepository from "../repositories/InventarioRepository";

class inventarioService {
    static async getInventario() {
        const response = await InventarioRepository.getInventario();
        return response;
    }
}

export default inventarioService