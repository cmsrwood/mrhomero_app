import VentasRepository from "../repositories/VentasRepository";

const VentasService = {
    ventas: async () => {
        const response = await VentasRepository.ventas();
        if (response) {
            return response;
        }
        return [];
    }
}

export default VentasService;   