import ImagenesRepository from "../repositories/ImagenesRepository";

class ImagenesService {
    static async subirImagen(data) {
            const response= await ImagenesRepository.subirImagen(data);
            console.log('Imagen subida con exito:', response.data)
            return response.data
        }
}
export default ImagenesService