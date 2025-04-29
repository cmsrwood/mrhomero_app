import { useState, useEffect, useMemo } from "react";
import ClientesService from "../services/ClientesServices";
import AuthService from "../services/AuthService";

export default function useClientes(type, params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Memoriza los params para que no cambien en cada render
    const stableParams = useMemo(() => params, [JSON.stringify(params)]);

    const refetch = () => {
        setRefreshTrigger(prev => prev + 1);
    };

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
                    results = await ClientesService.getCliente(stableParams.id);
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
    }, [refreshTrigger]);

    return { data, loading, error, refetch };
}