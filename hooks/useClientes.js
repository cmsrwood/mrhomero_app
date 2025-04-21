import { useState, useEffect } from "react";
import ClientesService from "../services/ClientesServices";
import AuthService from "../services/AuthService";

export default function useClientes(type, params = {}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                let results = [];

                if (type === "clientesRegistrados") {
                    results = await ClientesService.getUsuariosRegistradosPorMes();
                }
                else if (type === "clientesRegistradosTotales") {
                    results = await ClientesService.getUsuariosRegistrados();
                }
                else if (type === "resenasUsuarios") {
                    results = await ClientesService.getResenasUsuarios();
                }
                else if (type === "clienteConToken") {
                    const token = await AuthService.getToken();
                    const tokenData = JSON.parse(atob(token.split(".")[1]));
                    const id = tokenData.id;
                    results = await ClientesService.getCliente(id);
                }
                else if (type === "cliente") {
                    results = await ClientesService.getCliente(params.id);
                }
                else if (type === "clientes") {
                    results = await ClientesService.getClientes();
                }

                if (isMounted) {
                    setData(results);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [type, JSON.stringify(params)]);

    return { data, loading, error };
}