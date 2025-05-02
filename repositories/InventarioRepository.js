import API from "../config/api";

class InventarioRepository {
    static async getInventario() {
        const response = await API.get(`/tienda/inventario`);
        return response.data
    }
}

export default InventarioRepository