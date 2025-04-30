import ProveedoresService from "../services/ProveedoresService";
import { useState, useEffect } from "react";

export default function useProveedores(type = "proveedores", params = {}) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            let results = [];

            if (type === "proveedores") {
                if (params.id_proveedor) {
                    results = await ProveedoresService.getProveedores(params.id_proveedor);
                } else {
                    results = await ProveedoresService.getAll();
                }
            }

            setProveedores(results);
            setError(null);
        } catch (error) {
            setError(error);
            setProveedores([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [type, JSON.stringify(params)]);

    return { data: proveedores, loading, error, refetch: fetchData };
}
