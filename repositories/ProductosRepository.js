import API from "../config/api";

class ProductosRepository {
    static async crearProducto(data) {
        const response = await API.post("/tienda/productos/crear",data);
        return response;
    }
    static async actualizarProducto(id, data) {
        const response = await API.put(`/tienda/productos/actualizar/${id}`,data);
        return response;
    }
    static async eliminarProducto(id) {
        const response = await API.put(`/tienda/productos/eliminar/${id}`); 
        return response;
    }
    static async restaurarProducto(id) {
        const response = await API.put(`/tienda/productos/restaurar/${id}`); 
        return response;
    }
}

export default ProductosRepository;