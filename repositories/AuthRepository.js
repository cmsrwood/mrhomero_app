import API from "../config/api";

const AuthRepository = {
  login: async (email, password) => {
    const response = await API.post("/auth/ingresar", { email, password });
    return response.data;
  },

  validarToken: async () => {
    const response = await API.get("/auth/validarToken");
    return response.data;
  },

  registrar: async (user) => {
    const response = await API.post("/auth/registrar", user);
    return response.data;
  },
  recuperar: async (email) => {
    const response = await API.post("/auth/recuperar", { email });
    return response.data;
  },
};

export default AuthRepository;