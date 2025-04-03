import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import DefaultLayout from '../../components/DefaultLayout';
import { useNavigation } from '@react-navigation/native';
import MenuService from '../../services/MenuServices';

export default function MenuDefaultScreen() {
    const [categorias, setCategorias] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriasRes] = await Promise.all([
                    MenuService.mostrar(),
                ]);
                console.log("Datos obtenidos:", categoriasRes); // Corregido
                setCategorias(categoriasRes); // Corregido
            } catch (error) {
                console.log("Error al obtener datos:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <DefaultLayout>
            <View style={styles.container}>
                <FlatList
                    data={categorias}
                    keyExtractor={(categoria) => categoria.id_categoria.toString()}
                    renderItem={({ item: categoria }) => (
                        <TouchableOpacity onPress={() => navigation.navigate("CategoriaDefaultScreen")}>
                            <Card style={styles.card}>
                                <Image source={{ uri: categoria.cat_foto }} style={styles.img} />
                                <Card.Content style={styles.contentCard}>
                                    <Text style={styles.textCard}>{categoria.cat_nom}</Text>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </DefaultLayout>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    img: {
        width: 299,
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        
        
    },
    contentCard: {
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#fff',
        alignItems: 'center',
        marginTop: '10%',
        width: '100%',

    },
    textCard: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 260,
        backgroundColor: '#2B3035',
        borderRadius: 20,
        elevation: 10,
        marginBottom: 20,
        marginTop: 20,
        paddingBottom: 50,
        paddingTop: 5,
        borderBlockColor: '#000',
        borderWidth: 1,
        shadowColor: '#fff',
    

    },
})