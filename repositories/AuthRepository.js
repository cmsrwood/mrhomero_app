import API from "../config/api";

class AuthRepository {
  static async login(email, password) {
    const response = await API.post("/auth/ingresar", { email, password });
    return response.data;
  }

  static async validarToken() {
    const response = await API.get("/auth/validarToken");
    return response.data;
  }

  static async registrar(user) {
    const response = await API.post("/auth/registrar", user);
    return response.data;
  }
  static async recuperar(email) {
    const response = await API.post("/auth/recuperar", { email });
    console.log(response.data);
    return response.data;
  }

  static async resetPassword(email, password) {
    const response = await API.post("/auth/resetPassword", { email, password });
    return response.data;
  }
};

export default AuthRepository;