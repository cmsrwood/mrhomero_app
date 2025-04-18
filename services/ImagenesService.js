import ImagenesRepository from "../repositories/ImagenesRepository";

class ImagenesService {
    static async subirImagen(data) {
        const response = await ImagenesRepository.subirImagen(data);
        return response
    }
}
export default ImagenesService