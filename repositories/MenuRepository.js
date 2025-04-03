import API from "../config/api";

class MenuRepository {
    static async getCategorias() {
        const response = await API.get("/tienda/categorias");
        return response.data
    }
}

export default MenuRepository;