import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, FlatList, Image } from 'react-native';

export default function Details({ navigation }) {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Es importante usar el "http://" en vez de "http" para que funcione correctamente
        axios.get('http://localhost:4400/api/tienda/productos')
            .then(response => {
                setProductos(response.data);  // Asegúrate de que la respuesta sea un array
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>productos</Text>


            <FlatList
                data={productos || []}
                keyExtractor={(producto) => producto.id_producto}
                renderItem={({ item: producto }) => (
                    <View style={styles.item}>
                        <Image source={{ uri: producto.pro_foto }} style={styles.img} />
                        <View style={styles.textoo}>
                            <Text>{producto.pro_nom ?? 'Sin nombre'}</Text>
                            <Text>{producto.pro_precio}</Text>
                        </View>
                    </View>
                )}
            />

            <Button title="Volver" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefeff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    item: {
        flex: 1,
        borderColor: '#B7B7B7',
        borderWidth: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    textoo:
    {
        marginLeft: 10,
    },
    img: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 200,
        height: 200,
    }
});
