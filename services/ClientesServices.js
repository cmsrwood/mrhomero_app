import ClientesRepository from "../repositories/ClientesRepository";

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
}

export default ClientesService;