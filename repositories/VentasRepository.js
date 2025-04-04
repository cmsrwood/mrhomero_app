import API from "../config/api";

class VentasRepository {
    static async getVentas() {
        const response = await API.get("/api/ventas")
        return response.data
    }

    static async getProductosMasVendidos(year, month) {
        const response = await API.get(`/tienda/ventas/productosMasVendidos/${year}/${month}`);
        return response.data
    }
}

export default VentasRepository;