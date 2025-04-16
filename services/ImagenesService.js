import ImagenesRepository from "../repositories/ImagenesRepository";

class ImagenesService {
    static async subirImagen(data) {
        return await ImagenesRepository.subirImagen(data);
    }
}
export default ImagenesService