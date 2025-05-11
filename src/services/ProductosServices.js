import ProductosRepository from "../repositories/ProductosRepository";

class ProductosServices {
    static async crearProducto(data) {
        try {
            const response = await ProductosRepository.crearProducto(data);
            return response || null
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }
    static async actualizarProducto(id,data) {
        try {
            const response = await ProductosRepository.actualizarProducto(id,data);
            return response || null
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }
    static async eliminarProducto(id) {
        try {
            const response = await ProductosRepository.eliminarProducto(id);
            return response || null
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }
    static async restaurarProducto(id) {
        try {
            const response = await ProductosRepository.restaurarProducto(id);
            return response || null
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }
}

export default ProductosServices