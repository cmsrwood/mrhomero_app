import InventarioRepository from "../repositories/InventarioRepository";

class inventarioService {
    static async getInventario() {
        const response = await InventarioRepository.getInventario();
        return response;
    }

    static async crearProductoInventario(data) {
        const response = await InventarioRepository.crearProductoInventario(data);
        return response;
    }

    static async editarProductoInventario(id, data) {
        const response = await InventarioRepository.editarProductoInventario(id, data);
        return response;
    }

    static async eliminarProductoInventario(id) {
        const response = await InventarioRepository.eliminarProductoInventario(id);
        return response;
    }
}

export default inventarioService