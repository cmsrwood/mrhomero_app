import ProveedoresRepository from "../repositories/ProveedoresRepository";
class ProveedoresService {
    static async getProveedores(id) {
        try{
            const data = await ProveedoresRepository.getProveedores(id)
            return data || [];
        }catch(error){
            console.log(error);
            return [];
        }
        }
        static async getAll() {
            try{
                const data = await ProveedoresRepository.getAll()
                return data || [];
            }catch(error){
                console.log(error);
                return [];
            }
        }
        static async crearProveedor(data) {
            try{
                const response = await ProveedoresRepository.crearProveedor(data)
                return response || null;
            }catch(error){
                console.log(error);
                return [];
            }
        }
        static async actualizarProveedor(id, data) {
            try{
                const response = await ProveedoresRepository.actualizarProveedor(id, data)
                return response || null;
            }catch(error){
                console.log(error);
                return [];
            }
        }
        static async eliminarProveedor(id) {
            try{
                const response = await ProveedoresRepository.eliminarProveedor(id)
                return response || null;
            }catch(error){
                console.log(error);
                return [];
            }
        }
    }

export default ProveedoresService