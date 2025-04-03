import React, { useState, useEffect } from "react";
import CategoriasService from "../services/MenuServices";

export default function useCategorias(type, params = {}) { 

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { 
        fetchData();
    }, [type, params]);

    const fetchData = async () => { 
        try { 
            setLoading(true);
            let results = []; 
            if (type === "categorias") { 
                results = await CategoriasService.getCategorias(); 
            } 
            setData(results); 
        } catch (error) { 
            setError(error); 
        } finally { 
            setLoading(false); 
        } 
    }
return { data, loading, error };
}