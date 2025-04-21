import API from "../config/api";

class VentasRepository {
    static async getVentas() {
        const response = await API.get("/tienda/ventas")
        return response.data
    }

    static async getVenta(id) {
        const response = await API.get(`/tienda/ventas/${id}`);
        return response.data
    }

    static async getProductosMasVendidos(year, month) {
        const response = await API.get(`/tienda/ventas/productosMasVendidos/${year}/${month}`);
        return response.data
    }

    static async getVentasMensuales(ano, mes) {
        const response = await API.get(`/tienda/ventas/ventasMensuales/${ano}/${mes}`);
        return response.data
    }

    static async getVentasAnuales(ano) {
        const response = await API.get(`/tienda/ventas/ventasAnuales/${ano}`);
        return response.data
    }

    static async getCuentaProductosVendidosPorMes(ano, mes) {
        const response = await API.get(`/tienda/ventas/cuentaProductosVendidosPorMes/${ano}/${mes}`);
        return response.data[0].cantidad
    }

    static async getCuentaVentasMes(ano, mes) {
        const response = await API.get(`/tienda/ventas/cuentaVentasMes/${ano}/${mes}`);
        return response.data[0].total
    }
    static async getReportePDF(tipo, ano, mes) {
        const endpoint = tipo === 'anual'
            ? `/tienda/ventas/reporte/${ano}`
            : `/tienda/ventas/reporte/${ano}/${mes}`;

        const response = await API.get(endpoint, { responseType: 'blob', });

        return response.data;
    }
    static async getIA(tipo, ano, mes) {
        const endpoint = tipo === 'anual'
            ? `/tienda/ventas/reporteIA/${ano}`
            : `/tienda/ventas/reporteIA/${ano}/${mes}`;

        const response = await API.get(endpoint);
        return response.data;
    }
    static async getProductosMasCompradosPorCliente(id) {
        const response = await API.get(`/tienda/ventas/productosMasCompradosPorCliente/${id}`);
        return response.data;
    }

    static async getDetalleVenta(id) {
        const response = await API.get(`/tienda/ventas/detalle/${id}`);
        return response.data;
    }


}

export default VentasRepository;