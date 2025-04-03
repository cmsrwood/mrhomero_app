import API from "../config/api";

const MenuRepository = {
    mostrar: async () => {
        try {
            const response = await API.get("/tienda/categorias");
            return response.data;
        } catch (error) {
            console.log(error);
            return []; 
        }
    },
};

export default MenuRepository;