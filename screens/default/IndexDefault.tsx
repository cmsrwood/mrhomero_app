import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import { useNavigation } from '@react-navigation/native'
import foto from '../../assets/slider/hamburguesa.jpg'
import logo from '../../assets/favicon.png'
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const images = [
    { id: '1', image: foto },
    { id: '2', image: logo },
    { id: '3', image: foto },
]


export default function IndexDefault() {
    const navigation = useNavigation();

    return (
        <DefaultLayout>
            <View>
                <Text >Mr homero</Text>
            </View>
            <View style={styles.slider}>
                <Swiper autoplay autoplayTimeout={5} showsPagination>
                    {images.map((item) => (
                        <Image style={styles.img} key={item.id} source={item.image} />
                    ))}
                </Swiper>
            </View>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    slider: {
        width: width,
        height: 200,
    },
    img: {
        width: 390,
        height: 200,
        resizeMode: 'cover',
    }
})