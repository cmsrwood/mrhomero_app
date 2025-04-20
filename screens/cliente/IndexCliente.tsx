import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DefaultLayout from '../../components/DefaultLayout'
import { useNavigation } from '@react-navigation/native'
import foto from '../../assets/img/indexCliente/inicio9.jpg';
import Swiper from 'react-native-swiper';
import useMenu from '../../hooks/useMenu'
import useVentas from '../../hooks/useVentas'
import useClientes from '../../hooks/useClientes'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window');

export default function IndexCliente() {
    const navigation = useNavigation();

    const { data: cliente, refetch: refetchCliente } = useClientes("clienteConToken");
    const { data: productosMasVendidos, refetch: refetchProductos } = useVentas("productosMasVendidos", { year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
    const { data: productosMasCompradosPorCliente, refetch: refetchProductosMasCompradosPorCliente } = useVentas("productosMasCompradosPorCliente");

    const handleNavigateToProducto = (id_producto, pro_nom) => {
        navigation.navigate("Menu", {
            screen: "ProductoScreen",
            params: {
                id_producto: id_producto,
                pro_nom: pro_nom
            }
        });
    };

    return (
        <DefaultLayout>
            <View style={[styles.backgroundContainer, { width: width, height: height * 0.4 }]}>
                <Image
                    source={foto}
                    style={styles.fixedBackgroundImage}
                    resizeMode="cover"
                />
                <Swiper
                    autoplay
                    autoplayTimeout={5}
                    showsPagination={true}
                    dotColor="rgba(255,255,255,0.5)"
                    activeDotColor="#ffcc00"
                    paginationStyle={{ bottom: 30 }}
                    style={styles.swiperOverlay}
                >
                    {/* Slide 1 */}
                    <View style={styles.slideContent}>
                        <Text style={styles.tituloPrincipal}>Bienvenido {cliente.user_nom}</Text>
                        <Text style={styles.subtitulo}>Gracias por elegirnos</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
                                <Ionicons name="menu" size={20} color="black"></Ionicons>
                                <Text style={styles.buttonText}>Menu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recompensas')}>
                                <Ionicons name="gift-outline" size={20} color="black"></Ionicons>
                                <Text style={styles.buttonText}>Recompensas</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Slide 2 - Solo contenido */}
                    <View style={styles.slideContent}>
                        <Text style={styles.tituloPrincipal}>Tienes {cliente.user_puntos} puntos</Text>
                        <Text style={styles.subtitulo}>¡Reclama alguna recompensa!</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recompensas')}>
                                <Ionicons name="gift-outline" size={20} color="black"></Ionicons>
                                <Text style={styles.buttonText}>Recompensas</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Slide 3 - Solo contenido */}
                    <View style={styles.slideContent}>
                        <Text style={styles.tituloPrincipal}>
                            {productosMasCompradosPorCliente[0]?.pro_nom ? 'El producto que más has comprado' : 'Visita nuestra tienda'}
                        </Text>
                        <Text style={styles.subtitulo}>
                            {productosMasCompradosPorCliente[0]?.pro_nom ? productosMasCompradosPorCliente[0]?.pro_nom : 'Revisa nuestro menú'}
                        </Text>
                        <View style={styles.buttonContainer}>
                            {productosMasCompradosPorCliente[0]?.pro_nom ? (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate('MisCompras')}
                                >
                                    <Text style={styles.buttonText}>Mis compras</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate('Menu')}
                                >
                                    <Text style={styles.buttonText}>Menu</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Swiper>
            </View>
            <View >
                <Text style={styles.divider}>Populares</Text>
                <View style={styles.line} />
            </View>
            <View>
                <FlatList
                    data={productosMasVendidos}
                    keyExtractor={(item) => item.id_producto}
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
            </View>
            <View>
                <View >
                    <Text style={styles.divider}>Tus favoritos</Text>
                    <View style={styles.line} />
                </View>
                {productosMasCompradosPorCliente.length === 0 ? (
                    <Text style={{
                        color: "#ccc", fontSize: 18, textAlign: "center",
                        paddingVertical: 50
                    }}>No tienes favoritos</Text>
                ) : (
                    <FlatList
                        data={productosMasCompradosPorCliente}
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
                                    <Text style={styles.textCartas}>{producto.cantidad_vendida} </Text>
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
    backgroundContainer: {
        position: 'relative',
    },
    fixedBackgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    swiperOverlay: {
        backgroundColor: 'transparent',
    },
    slideContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    tituloPrincipal: {
        color: '#ffcc00',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitulo: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#ffcc00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        alignItems: 'center',
        alignContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
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