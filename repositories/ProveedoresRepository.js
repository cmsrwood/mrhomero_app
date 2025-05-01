import API from "../config/api";
class ProveedoresRepository {
    static async getProveedores() {
        const response = await API.get(`/tienda/proveedores`)
        return response.data
    }
    static async getAll() {
        const response = await API.get(`tienda/proveedores`)
        return response.data
    }

    static async crearProveedor(data) {
        const response = await API.post(`tienda/proveedores/crear`, data)
        return response
    }
    static async actualizarProveedor(id, data) {
        const response = await API.put(`tienda/proveedores/actualizar/${id}`, data)
        return response
    }
    static async eliminarProveedor(id) {
        const response = await API.delete(`tienda/proveedores/eliminar/${id}`)
        return response
    }
    
}
export default ProveedoresRepository