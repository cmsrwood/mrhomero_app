import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import DefaultLayout from '../../components/DefaultLayout';
import { useNavigation } from '@react-navigation/native';
import MenuService from '../../services/MenuServices';
import globalStyles from '../../styles/globalStyles';
import useCategorias from "../../hooks/useCategorias";

export default function MenuDefaultScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriasRes] = await Promise.all([
                    MenuService.mostrar(),
                ]);
                setCategorias(categoriasRes);
            } catch (error) {
                console.log("Error al obtener datos:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <DefaultLayout>
            <View >
                <Text style={globalStyles.title}>Categorias</Text>
                <ScrollView>
                    <View>
                        {categorias.map((categoria) => (
                            <TouchableOpacity key={categoria.id_categoria} onPress={() => navigation.navigate('CategoriaDefaultScreen', { id_categoria: categoria.id_categoria })}>
                                <Card style={styles.card}>
                                    <Image style={styles.img} source={{ uri: categoria.cat_foto }} />
                                    <Card.Content style={styles.cardContent}>
                                        <Text style={styles.cardText}>{categoria.cat_nom}</Text>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </DefaultLayout>
    );
}
const styles = StyleSheet.create({
    card: {
        display: 'flex',
        alignSelf: 'center',
        height: 300,
        width: 250,
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
        height: 240,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    cardText: {
        fontSize: 20,
        color: '#ccc',
        marginVertical: 5,
        fontWeight: 'bold',
    },

});

