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

    static async getCliente(id) {
        const response = await API.get(`personas/clientes/${id}`)
        return response.data
    }

    static async getClientes() {
        const response = await API.get('personas/clientes')
        return response.data
    }
    static async actualizarCliente(id, data) {
        const response = await API.put(`personas/clientes/actualizar/${id}`, data)
        return response
    }
}

export default ClientesRepository;