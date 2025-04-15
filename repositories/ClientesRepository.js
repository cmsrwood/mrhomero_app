import API from "../config/api";

class ClientesRepository {
    static async getUsuariosRegistradosPorMes() {
        const response = await API.get('personas/clientes/reportes/cuentaClientesUltimoMes/');
        return response.data
    }

    static async getUsuariosRegistrados() {
        const response = await API.get('personas/clientes/')
        return response.data
    }

    static async getResenasUsuarios() { 
        const response = await API.get('personas/clientes/resenas/datos/rating')
        return response.data
    }

}

export default ClientesRepository;