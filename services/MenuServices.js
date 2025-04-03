import MenuRepository from "../repositories/MenuRepository";

<<<<<<< Updated upstream
const MenuServices = {
    mostrar: async () => {
=======
class MenuService {
    static async getCategorias() {
>>>>>>> Stashed changes
        try {
            const data = await MenuRepository.getCategorias();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default MenuServices;