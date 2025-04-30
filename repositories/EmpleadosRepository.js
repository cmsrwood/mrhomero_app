import API from "../config/api";

class EmpleadosRepository { 
    static async getEmpelados() { 
        const response = await API.get('personas/empleados'); 
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
}

export default EmpleadosRepository