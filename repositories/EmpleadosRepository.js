import API from "../config/api";

class EmpleadosRepository { 
    static async getEmpelados() { 
        const response = await API.get('personas/empleados'); 
        return response.data
    }

    static async getEmpleado(id) { 
        const response = await API.get(`personas/empleados/${id}`); 
        return response.data
    }

    static async crearEmpleado(empleado) { 
        const response = await API.put('personas/empleados/crear', empleado); 
        return response
    }

    static async editarEmpleado(empleado) { 
        const response = await API.put(`personas/empleados/actualizar/`, empleado);
        return response
    }

    static async eliminarEmpleado(id) { 
        const response = await API.put(`personas/empleados/eliminar/${id}`)
        return response
    }

    //Muestra el total de horas trabajadas en el mes 
    static async mostrarHoraMes(id, mes, ano) { 
        const response = await API.get(`personas/empleados/horasPorMes/${id}/${ano}/${mes}`);
        return response.data
    }

    //Muestra los dias trabajados por el empleado
    static async mostrarDiasTrabajados(id, mes, ano) { 
        const response = await API.get(`personas/empleados/mostrarHorasMes/${id}/${ano}/${mes}`);
        return response.data
    }

    static async mostrarHorasPorDia(id, fecha) { 
        const response = await API.get(`personas/empleados/horasPorDia/${id}/${fecha}`);
        return response.data
    }
}

export default EmpleadosRepository