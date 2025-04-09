import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import useMenu from "../../hooks/useMenu"
import DefaultLayout from '../../components/DefaultLayout'
import { useRoute } from '@react-navigation/native';

export default function CategoriaScreen() {
  const route = useRoute();
  const { id_categoria, cat_nom } = route.params || {};
  const navigation = useNavigation();
  const {data: productos, loading, error} = useMenu("productos", {id_categoria})
    
  return (
    <DefaultLayout>
      <View >
        <Text style={globalStyles.title}>{cat_nom}</Text>
        <View style={styles.type}>
          {productos.map((producto) => (
            <TouchableOpacity key={producto.id_producto} onPress={() => navigation.navigate('ProductoDefaultScreen', { id_producto: producto.id_producto, pro_nom: producto.pro_nom })}>
              <Card style={styles.card}>
                <Image style={styles.img} source={{ uri: producto.pro_foto }} />
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.cardText}>{producto.pro_nom}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </DefaultLayout>
  )
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
    height: 230,
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

