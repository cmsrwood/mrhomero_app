import { useState, useEffect } from "react";
import RecompensasService from "../services/RecompensasService";

export default function useRecompensas(type, params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refetch = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                let results = [];

                if (type === "recompensas") {
                    results = await RecompensasService.getRecompensas();
                }
                else if (type === "recompensa") {
                    results = await RecompensasService.getRecompensa(params.id_recompensa);
                }

                else if (type === "recompensasObtenidas") {
                    results = await RecompensasService.getRecompensasObtenidasUsuario();
                }

                else if (type === "puntosUsuario") {
                    results = await RecompensasService.getPuntosUsuario();
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