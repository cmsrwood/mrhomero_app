import API from "../config/api";

export default class ImagenesRepository {
    static async subirImagen(data) {
        const response = await API.post("/imagenes/subir", data,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }); 

        return response;
    }
}