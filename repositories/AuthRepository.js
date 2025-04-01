import API from "../config/api";

const AuthRepository = {
  login: async (email, password) => {
    const response = await API.post("/api/auth/ingresar", { email, password });
    return response.data;
  },

  validarToken: async () => {
    const response = await API.get("/api/auth/validarToken");
    return response.data;
  },
};

export default AuthRepository;