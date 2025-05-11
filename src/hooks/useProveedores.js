import ProveedoresService from "../services/ProveedoresService";
import { useState, useEffect } from "react";

export default function useProveedores(type) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refetch = () => {
        setRefreshTrigger(prev => prev + 1);
    }
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                let results = [];

                if (type === "proveedores") {
                    results = await ProveedoresService.getProveedores();
                }

                if (isMounted) {
                    setData(results);
                    setError(null);

                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                    setData([]);
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
