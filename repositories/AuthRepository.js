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
    if (response.status === 200) return response.data;
    else return response.data.error;
  }

  static async resetPassword(email, newPassword, verificationCode) {
    const response = await API.post("/auth/resetPassword", { email, newPassword, verificationCode,});
    if (response.status === 200) return response.data;
    else return response.data.error;
  }
};

export default AuthRepository;