import MenuRepository from "../repositories/MenuRepository";

class MenuService {
    static async getCategorias() {
        try {
            const data = await MenuRepository.getCategorias();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getProductos(id) {
        try {
            const data = await MenuRepository.getProductos(id);
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default MenuService;