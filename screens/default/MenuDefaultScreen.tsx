import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import DefaultLayout from '../../components/DefaultLayout';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../styles/globalStyles';
import useMenu from "../../hooks/useMenu"
export default function MenuDefaultScreen() {

    const navigation = useNavigation();
    const { data: categorias, loading, error } = useMenu("categorias")

    return (
        <DefaultLayout>
            <View >
                <Text style={globalStyles.title}>Categorias</Text>
                    <View>
                        <FlatList
                            keyExtractor={(item) => item.id_categoria}
                            data={categorias}
                            renderItem={({ item: categoria }) => (
                                <Card style={styles.card}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('CategoriaDefaultScreen', { id_categoria: categoria.id_categoria , cat_nom: categoria.cat_nom })}
                                    >
                                        <Image source={{ uri: categoria.cat_foto }} style={styles.img} />
                                        <View style={styles.cardContent}>
                                            <Text style={styles.cardText}>{categoria.cat_nom}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Card>
                            )}
                        />
                    </View>
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

