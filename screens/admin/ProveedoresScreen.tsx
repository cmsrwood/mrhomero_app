import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native'
import { ActivityIndicator, Card } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout'
import globalStyles from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import ProveedoresService from '../../services/ProveedoresService'
import useProveedores from '../../hooks/useProveedores'
import { useRoute } from '@react-navigation/native'

export default function ProveedoresScreen() {
    const route = useRoute();
    const [modalAgregar, setModalAgregar] = useState(false);
    const {id_proveedor} = route.params || {};
    const { data: proveedores, refetch } = useProveedores("proveedores", { id_proveedor });
    console.log("id_proveedor:", id_proveedor);
    console.log("proveedores:", proveedores);

    return (
        <AdminLayout>
            <View>
                
                <View style={styles.up}>
                    <Text style={[globalStyles.title]}>proveedores</Text>
                    <TouchableOpacity style={styles.add}
                        onPress={
                            () => {
                                setModalAgregar(true);
                            }
                        }
                    >
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text style={styles.botonTexto} >Añadir</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    {proveedores ? proveedores.map((proveedor) => {
                        return (
                            <Card style={styles.card} key={proveedor.id_proveedor}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    
                                    <View>
                                        <Text style={{ color: '#fff' }}>{proveedor.prov_nombre}</Text>
                                        <Text style={{ color: '#fff' }}>{proveedor.prov_direccion}</Text>
                                    </View>
                                    
                                </View>
                            </Card>
                        )
                    }) : null}
                    
                </View>
               
            </View>
        </AdminLayout>
    )
}

const styles = StyleSheet.create({
 
    up: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50,
        gap: 20,
    },
    add: {
        width: 120,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#157347',
    },
    botonTexto: {
        color: '#fff',
        fontSize: 16
    },
    card: {
        backgroundColor: '#3A4149',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: 8,
        marginBottom: 15,
        height: 50
    },

})
