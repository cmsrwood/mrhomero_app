import EmpleadosRepository from "../repositories/EmpleadosRepository";
import AuthService from "./AuthService";
class EmpleadosService {
    static async getEmpleados() {
        try {
            const response = await EmpleadosRepository.getEmpelados();
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async getEmpleado(id) {
        try {
            const response = await EmpleadosRepository.getEmpleado(id);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async crearEmpleado(empleado) {
        try {
            const response = await EmpleadosRepository.crearEmpleado(empleado);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async editarEmpleado(empleado) {
        try {
            const response = await EmpleadosRepository.editarEmpleado(empleado);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async eliminarEmpleado(id) {
        try {
            const response = await EmpleadosRepository.eliminarEmpleado(id)
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async mostrarHoraMes(id, mes, ano) {
        try {
            const response = await EmpleadosRepository.mostrarHoraMes(id, mes, ano);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async mostrarDiasTrabajados(id, mes, ano) {
        try {
            const response = await EmpleadosRepository.mostrarDiasTrabajados(id, mes, ano);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async mostrarHorasPorDia(id, fecha) {
        try {
            const response = await EmpleadosRepository.mostrarHorasPorDia(id, fecha);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async iniciarHoraTrabajo(fecha, hora) {
        try {
            const token = await AuthService.getToken();
            const tokenData = JSON.parse(atob(token.split(".")[1]));
            const id = tokenData.id;
            const response = await EmpleadosRepository.iniciarHoraTrabajo(id, fecha, hora);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async terminarHoraTrabajo(fecha, hora) {
        try {
            const token = await AuthService.getToken();
            const tokenData = JSON.parse(atob(token.split(".")[1]));
            const id = tokenData.id;
            const response = await EmpleadosRepository.terminarHoraTrabajo(id, fecha, hora);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default EmpleadosService