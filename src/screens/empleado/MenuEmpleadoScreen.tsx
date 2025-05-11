import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, FlatList, Platform } from 'react-native'
import AdminLayout from '../../components/AdminLayout'
import { Ionicons } from '@expo/vector-icons'
import globalStyles from '../../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import useMenu from '../../hooks/useMenu';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MenuService from '../../services/MenuServices';
import ImagenesService from '../../services/ImagenesService';
import { showMessage } from 'react-native-flash-message';


export default function MenuAdminScreen() {

    const navigation = useNavigation();

    const { data: categorias} = useMenu("categorias");

    return (
        <AdminLayout>
            <View style={styles.general}>
                <Text style={globalStyles.title}>Menu</Text>
                {/*Contenido */}
                <View style={globalStyles.row}>
                    {categorias.length === 0 && <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", paddingVertical: 50 }}>No hay productos en esta categoria</Text>}
                    {categorias.map((categoria) => (
                        <View key={categoria.id_categoria} style={globalStyles.card}>
                            <TouchableOpacity onPress={() => navigation.navigate('Categoria', { id_categoria: categoria.id_categoria, cat_nom: categoria.cat_nom })}>
                                <Image source={{ uri: categoria.cat_foto }} style={globalStyles.img} />
                            </TouchableOpacity>
                            <View style={globalStyles.cardContent}>
                                <Text style={globalStyles.cardText}>{categoria.cat_nom}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </View>
        </AdminLayout>
    )
}


const styles = StyleSheet.create({
    general: {
        padding: 10,
    },
})
