import { useState, useEffect } from "react";
import MenuService from "../services/MenuServices";

export default function useCategorias(type, params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; 

        const fetchData = async () => {
            try {
                setLoading(true);
                let results = [];

                if (type === "categorias") {
                    results = await MenuService.getCategorias();
                }
                else if (type === "productos") {
                    results = await MenuService.getProductos(params.id_categoria);
                }
                else if (type === "producto"){
                    results = await MenuService.getProducto(params.id_producto);
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