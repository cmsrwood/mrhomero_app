import { useState, useEffect } from "react";
import MenuService from "../services/MenuServices";

export default function useMenu(type, params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refetch = () => {
        console.log('Actualizando...')
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                let results = [];

                if (type === "categorias") {
                    results = await MenuService.getCategorias();
                } else if (type === "productos") {
                    results = await MenuService.getProductos(params.id_categoria);
                } else if (type === "producto") {
                    results = await MenuService.getProducto(params.id_producto);
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