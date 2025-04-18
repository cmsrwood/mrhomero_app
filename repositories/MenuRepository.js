import API from "../config/api";

class MenuRepository {
    static async getCategorias() {
        const response = await API.get("/tienda/categorias");
        return response.data
    }
    static async getProductos(id) {
        const response = await API.get(`/tienda/productos/categoria/${id}`);
        return response.data
    }
    static async getProducto(id) {
        const response = await API.get(`/tienda/productos/${id}`);
        return response.data
    }
    static async crearCategoria(data) {
        const response = await API.post("/tienda/categorias/crear", data);
        return response
    }
    static async actualizarCategoria(id, data) {
        const response = await API.put(`/tienda/categorias/actualizar/${id}`, data);
        return response
    }
    static async eliminarCategoria(id) {
        const response = await API.delete(`/tienda/categorias/eliminar/${id}`);
        return response.data
    }
}

export default MenuRepository;