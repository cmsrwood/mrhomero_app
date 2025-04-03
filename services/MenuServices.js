import MenuRepository from "../repositories/MenuRepository";

const MenuService = {
    mostrar: async () => {
        try {
            const response = await MenuRepository.mostrar();
            return response;
        } catch (error) {
            console.log(error);
            return []; 
        }
    },
};

export default MenuService;