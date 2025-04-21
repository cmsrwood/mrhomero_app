import React, { useState, useEffect, useMemo } from "react";
import VentasService from "../services/VentasService";
import AuthService from "../services/AuthService";

export default function useVentas(type, params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoriza los params para que no cambien en cada render
    const stableParams = useMemo(() => params, [JSON.stringify(params)]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                let results = [];

                if (type === "ventas") {
                    results = await VentasService.getVentas();
                }

                if (type === "venta") {
                    results = await VentasService.getVenta(stableParams.id);
                }

                if (type === "productosMasVendidos") {
                    const { year, month } = stableParams;
                    results = await VentasService.getProductosMasVendidos(year, month);
                }

                if (type === "ventasMensuales") {
                    const { ano, mes } = stableParams;
                    results = await VentasService.getVentasMensuales(ano, mes);
                }

                if (type === "ventasAnuales") {
                    const { ano } = stableParams;
                    results = await VentasService.getVentasAnuales(ano);
                }

                if (type === "cuentaProductosVendidosPorMes") {
                    const { ano, mes } = stableParams;
                    results = await VentasService.getCuentaProductosVendidosPorMes(ano, mes);
                }

                if (type === "cuentaVentasMes") {
                    const { ano, mes } = stableParams;
                    results = await VentasService.getCuentaVentasMes(ano, mes);
                }

                if (type === "reportePDF") {
                    const { tipo, ano, mes } = stableParams;
                    results = await VentasService.getReportePDF(tipo, ano, mes);
                }

                if (type === "IA") {
                    const { tipo, ano, mes } = stableParams;
                    results = await VentasService.getIA(tipo, ano, mes);
                }

                if (type === "productosMasCompradosPorCliente") {
                    const token = await AuthService.getToken();
                    const tokenData = JSON.parse(atob(token.split(".")[1]));
                    const id = tokenData.id;
                    results = await VentasService.getProductosMasCompradosPorCliente(id);
                }

                if (type === "detalleVenta") {
                    const { id } = stableParams.id;
                    results = await VentasService.getDetalleVenta(id);
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
    }, [type, stableParams]);

    return { data, loading, error };
}