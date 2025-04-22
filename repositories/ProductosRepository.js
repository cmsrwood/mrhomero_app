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
}

export default ProductosRepository;