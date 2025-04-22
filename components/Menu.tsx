import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';
import useMenu from "../hooks/useMenu";
import Loader from './Loader';
export default function Menu() {

    const navigation = useNavigation();
    const { data: categorias, refetch, isLoading: isCategoriasloading, error } = useMenu("categorias")

    useEffect(() => {
        refetch()
    }, []);

    return (

        <View >
            {isCategoriasloading || !categorias ? (
                <View>
                    <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>Cargando categorias...</Text>
                    <Loader />
                </View>
            ) : (
                <View>
                    <Text style={globalStyles.title}>Categorias</Text>
                    <View style={styles.type}>
                        {categorias.length == 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay categorias</Text>}
                        {categorias.map((categoria) => (
                            <Card key={categoria.id_categoria} style={styles.card}>
                                <TouchableOpacity onPress={() => navigation.navigate('CategoriaScreen', { id_categoria: categoria.id_categoria, cat_nom: categoria.cat_nom })}>
                                    <Image source={{ uri: categoria.cat_foto }} style={styles.img} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardText}>{categoria.cat_nom}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </View>
                </View>
            )}

        </View>

    );
}
const styles = StyleSheet.create({
    type: {
        padding: 20,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    card: {
        display: 'flex',
        alignSelf: 'center',
        height: 200,
        width: 160,
        marginVertical: 10,
        backgroundColor: '#2B3035',
        shadowColor: '#fff',
        padding: 0,
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
    },
    img: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    cardText: {
        fontSize: 15,
        color: '#ccc',
        marginVertical: 5,
        fontWeight: 'bold',
    },

});

