import API from "../config/api";

class InventarioRepository {
    static async getInventario() {
        const response = await API.get(`/tienda/inventario`);
        return response.data
    }

    static async crearProductoInventario(data) {
        const response = await API.post(`tienda/inventario/crear`, data);
        return response
    }

    static async editarProductoInventario(id, data) {
        const response = await API.put(`tienda/inventario/actualizar/${id}`, data);
        return response
    }

    static async eliminarProductoInventario(id) {
        const response = await API.delete(`tienda/inventario/eliminar/${id}`);
        return response
    }
}

export default InventarioRepository