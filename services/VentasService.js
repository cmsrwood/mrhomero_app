import VentasRepository from "../repositories/VentasRepository";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { showMessage } from "react-native-flash-message";

class VentasService {
    static async getVentas() {
        try {
            const data = await VentasRepository.getVentas();
            return data || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    static async getProductosMasVendidos(year, month) {
        try {
            const data = await VentasRepository.getProductosMasVendidos(year, month);
            if (!data) return [];
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getVentasMensuales(ano, mes) {
        try {
            const data = await VentasRepository.getVentasMensuales(ano, mes);
            if (!data) return [];
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getVentasAnuales(ano) {
        try {
            const data = await VentasRepository.getVentasAnuales(ano);
            if (!data) return [];
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getCuentaProductosVendidosPorMes(ano, mes) {
        try {
            const data = await VentasRepository.getCuentaProductosVendidosPorMes(ano, mes);
            if (!data) return [];
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getCuentaVentasMes(ano, mes) {
        try {
            const data = await VentasRepository.getCuentaVentasMes(ano, mes);
            if (!data) return [];
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getReportePDF(tipo, ano, mes, accion = 'guardar') {
        try {
            const pdfBlob = await VentasRepository.getReportePDF(tipo, ano, mes);

            const base64Data = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(pdfBlob);
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
            });

            const fileName = `reporte-${tipo}-${ano}${tipo === 'mensual' ? `-${mes}` : ''}.pdf`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (accion === 'compartir' && await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Compartir Reporte de Ventas',
                    subject: 'Reporte de Ventas - MiNegocio',
                    UTI: 'com.adobe.pdf'
                }
                );
                showMessage({
                    message: 'PDF compartido con éxito',
                    icon: 'success',
                    type: 'success',
                    duration: 2000
                });
            } else {
                showMessage({
                    message: 'PDF guardado correctamente',
                    description: `Reporte guardado en: ${fileUri}`,
                    icon: 'success',
                    type: 'success',
                    duration: 3000
                });
            }

            return fileUri;

        } catch (error) {
            console.error('Error:', error);
            showMessage({
                message: 'Error al procesar el PDF',
                description: error.message,
                type: 'danger',
                duration: 4000
            });
            throw error;
        }
    }
}

export default VentasService;   