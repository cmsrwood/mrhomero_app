import API from "../config/api";

const VentasRepository = {
    ventas: async () => {
        const response = await API.get("/api/ventas");
        return response.data;
    }
};

export default VentasRepository;