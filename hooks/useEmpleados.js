import { useState, useEffect } from "react";
import EmpleadosService from "../services/EmpleadosService";

export default function useEmpleados(type, params = {}) {

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

                if (type === 'Empleados') {
                    results = await EmpleadosService.getEmpleados();
                }

                if (type === 'Empleado') {
                    results = await EmpleadosService.getEmpleado(params.id_empleado);
                }

                if (type === 'HorasTrabajadasPorMes') {
                    const { id_empleado, mes, ano } = params
                    results = await EmpleadosService.mostrarHoraMes(id_empleado, mes, ano);
                }

                if (type === 'DiasTrabajados') {
                    const { id_empleado, mes, ano } = params
                    results = await EmpleadosService.mostrarDiasTrabajados(id_empleado, mes, ano);
                }

                if (type === 'HorasPorDia') {
                    const { id_empleado, fecha } = params
                    results = await EmpleadosService.mostrarHorasPorDia(id_empleado, fecha);
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