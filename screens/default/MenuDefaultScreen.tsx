import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Card, Button, } from 'react-native-paper';
import DefaultLayout from '../../components/DefaultLayout';
import img from '../../assets/slider/hamburguesa.jpg';
import { useNavigation } from '@react-navigation/native';


export default function MenuDefaultScreen() {
    const navigation = useNavigation();
    return (

        <DefaultLayout>
            <View style={styles.container}>
                <TouchableOpacity>
                    <Card style={styles.card}>
                        <Card.Title title="" />
                        <Image source={img} style={styles.img} />
                        <Card.Content style={styles.contentCard}>
                            <Text style={styles.textCard}>Categoria</Text>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>

            </View>
        </DefaultLayout>
    )

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
        borderTopRightRadius: 20
    },
    contentCard: {
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#fff',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',

    },
    textCard: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
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
        borderBlockColor: '#fff',
        shadowColor: '#fff',

    },
})