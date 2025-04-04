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
    
}

export default MenuRepository;