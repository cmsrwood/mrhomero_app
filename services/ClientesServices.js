import ClientesRepository from "../repositories/ClientesRepository";
import AuthService from "./AuthService";

class ClientesService {
    static async getUsuariosRegistradosPorMes() {
        try {
            const data = await ClientesRepository.getUsuariosRegistradosPorMes();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async getUsuariosRegistrados() {
        try {
            const data = await ClientesRepository.getUsuariosRegistrados();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async getResenasUsuarios() {
        try {
            const data = await ClientesRepository.getResenasUsuarios();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getCliente(id) {
        try {
            const data = await ClientesRepository.getCliente(id);
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async getClientes() {
        try {
            const data = await ClientesRepository.getClientes();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async actualizarCliente(data) {
        try {
            const token = await AuthService.getToken();
            const tokenData = JSON.parse(atob(token.split(".")[1]));
            const id = tokenData.id;
            const response = await ClientesRepository.actualizarCliente(id, data);
            return response || null;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default ClientesService;