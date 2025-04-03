import MenuRepository from "../repositories/MenuRepository";

const MenuServices = {
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

export default MenuServices;