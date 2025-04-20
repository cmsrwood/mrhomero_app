import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import { useNavigation } from '@react-navigation/native'
import foto from '../../assets/img/slider/hamburguesa.jpg'
import Swiper from 'react-native-swiper';
import useMenu from '../../hooks/useMenu'
import useVentas from '../../hooks/useVentas'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window');


const images = [
    { id: '1', image: foto },
    { id: '2', image: foto },
    { id: '3', image: foto },
]



export default function IndexDefault() {
    const navigation = useNavigation();

    const { data: categorias } = useMenu("categorias");
    const { data: productos } = useVentas("productosMasVendidos", { year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

    const handleNavigateToCategoria = (id_categoria, cat_nom) => {
        navigation.navigate("Menu", {
            screen: "CategoriaDefaultScreen",
            params: {
                id_categoria: id_categoria,
                cat_nom: cat_nom
            }
        });
    };

    const handleNavigateToProducto = (id_producto, pro_nom) => {
        navigation.navigate("Menu", {
            screen: "ProductoDefaultScreen",
            params: {
                id_producto: id_producto,
                pro_nom: pro_nom
            }
        });
    };


    return (
        <DefaultLayout>
            <View style={styles.sliderContainer}>
                <Swiper autoplay autoplayTimeout={5} showsPagination={false}>
                    {images.map((item) => (
                        <View key={item.id} style={styles.slider}>
                            <Image style={styles.img} source={item.image} />
                            <Text style={styles.textSlider}>Si lo que buscas es sabor {"\n"} Mr. Homero es el mejor</Text>
                        </View>
                    ))}
                </Swiper>
            </View>
            <View >
                <Text style={styles.divider}>Categorias</Text>
                <View style={styles.line} />
            </View>
            <View>
                <FlatList
                    data={categorias}
                    keyExtractor={(item) => item.id_categoria}
                    horizontal={true}
                    renderItem={({ item: categoria }) => (
                        <TouchableOpacity onPress={() => handleNavigateToCategoria(categoria.id_categoria, categoria.cat_nom)}>
                            <View style={styles.cartasContainer}>
                                <View key={categoria.id_categoria} style={styles.cartas}>
                                    < Image source={{ uri: categoria.cat_foto }} style={styles.imgCartas} />
                                    <Text style={styles.textCartas}>{categoria.cat_nom}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View>
                <View >
                    <Text style={styles.divider}>Destacados</Text>
                    <View style={styles.line} />
                </View>
                {productos.length === 0 ? (
                    <Text style={{
                        color: "#ccc", fontSize: 18, textAlign: "center",
                        paddingVertical: 50
                    }}>No hay productos destacados este mes</Text>
                ) : (
                    <FlatList
                        data={productos}
                        keyExtractor={(item, index) => `${item.pro_nom}-${index}`}
                        horizontal={true}
                        renderItem={({ item: producto }) => (
                            <TouchableOpacity style={styles.cartasContainer} onPress={() => handleNavigateToProducto(producto.id_producto, producto.pro_nom)}>
                                <View>
                                    <View style={styles.cartas}>
                                        <Image source={{ uri: producto.pro_foto }} style={styles.imgCartas} />
                                        <Text style={styles.textCartas}>{producto.pro_nom}</Text>
                                    </View>
                                </View>
                                <View style={styles.flame}>
                                    <Ionicons name="flame" size={24} color="black" style={{ color: "orange" }} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}

            </View>
        </DefaultLayout >
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        width: width,
        height: 300,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        overflow: 'hidden',
        position: 'relative'
    },
    slider: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    img: {
        resizeMode: 'cover',
        height: "100%",
        width: "100%",
        opacity: 0.6
    },
    textSlider: {
        color: '#fff',
        fontSize: 23,
        position: 'absolute',
        bottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: 20
    },
    divider: {
        color: '#fff',
        fontSize: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        top: 10,
        fontWeight: 'bold',
        letterSpacing: 2
    },
    line: {
        alignSelf: 'flex-end',
        marginRight: 20,
        width: '50%',
        height: 1,
        backgroundColor: '#FFC107',
    },
    cartasContainer: {
        display: 'flex',
        marginTop: 6,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 6,
        width: 100
    },
    cartas: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: 20
    },
    imgCartas: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    textCartas: {
        color: '#fff',
        paddingTop: 6,
        fontWeight: 'bold',

    },
    precioCartas: {
        color: '#FFC107',
        paddingTop: 4
    },
    flame: {
        backgroundColor: "#2B3035",
        borderRadius: 10,
        position: "absolute",
        top: 10,
        right: -15,
        display: "flex",
        flexDirection: "row",
        gap: 5
    }
})