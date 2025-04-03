import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import { useNavigation } from '@react-navigation/native'
import foto from '../../assets/slider/hamburguesa.jpg'
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const images = [
    { id: '1', image: foto },
    { id: '2', image: foto },
    { id: '3', image: foto },
]

const categorias = [
    { id: '1', title: 'Pizzas', image: foto },
    { id: '2', title: 'Hamburguesas', image: foto },
    { id: '3', title: 'Perros', image: foto },
    { id: '4', title: 'Dorilocos', image: foto },
    { id: '5', title: 'Dorilocos', image: foto },
    { id: '6', title: 'Dorilocos', image: foto },
    { id: '7', title: 'Dorilocos', image: foto },
    { id: '8', title: 'Dorilocos', image: foto },
]

const productos = [
    { id: '1', title: 'Pizzas', image: foto, precio: "20.000" },
    { id: '2', title: 'Hamburguesas', image: foto, precio: "20.000" },
    { id: '3', title: 'Perros', image: foto, precio: "20.000" },
    { id: '4', title: 'Dorilocos', image: foto, precio: "20.000" },
    { id: '5', title: 'Dorilocos', image: foto, precio: "20.000" },
    { id: '6', title: 'Dorilocos', image: foto, precio: "20.000" },
    { id: '7', title: 'Dorilocos', image: foto, precio: "20.000" },
    { id: '8', title: 'Dorilocos', image: foto, precio: "20.000" },
]


export default function IndexDefault() {
    const navigation = useNavigation();

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
                <ScrollView horizontal>
                    <View style={styles.cartasContainer}>
                        {categorias.map((item) => (
                            <View key={item.id} style={styles.cartas}>
                                < Image source={item.image} style={styles.imgCartas} />
                                <Text style={styles.textCartas}>{item.title}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View>
                <View >
                    <Text style={styles.divider}>Destacados</Text>
                    <View style={styles.line} />
                </View>
                <ScrollView horizontal>
                    <View style={styles.cartasContainer}>
                        {productos.map((item) => (
                            <View key={item.id} style={styles.cartas}>
                                < Image source={item.image} style={styles.imgCartas} />
                                <Text style={styles.textCartas}>{item.title}</Text>
                                <Text style={styles.precioCartas}>$ {item.precio}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
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
        flexDirection: 'row',
        gap: 23,
        margin: 20,
        paddingHorizontal: 10
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
        fontWeight: 'bold'

    },
    precioCartas: {
        color: '#FFC107',
        paddingTop: 4
    }
})