import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import globalStyles from '../../styles/globalStyles';
import useMenu from "../../hooks/useMenu"
import { NumericFormat } from 'react-number-format';
import { useRoute } from '@react-navigation/native';


export default function ProductoScreen() {
  const route = useRoute();
  const { id_producto, pro_nom } = route.params || {};
  const { data: producto, loading, error } = useMenu("producto", { id_producto })
  return (
    <DefaultLayout>
      <View>
        <Text style={globalStyles.title}>{pro_nom}</Text>
        <View >
          <Image source={{ uri: producto.pro_foto }} style={styles.image} />
        </View>
        <View style={styles.desp}>
          <Text style={styles.desc}>{producto.pro_desp}</Text>
          <Text style={styles.puntos}>Puntos: {producto.pro_puntos}</Text>
          <NumericFormat style={styles.precio} value={producto.pro_precio} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'$'} />
        </View>
      </View>
    </DefaultLayout>
  )
}
const styles = StyleSheet.create({
 
  image: {
    alignSelf: 'center',
    width: 340,
    height: 340,
    borderColor: '#B7B7B7',
  },
  desp:{
    marginLeft: 40,
    marginTop: 10
  },
  desc:{
    color: '#fff',
    fontSize: 20
  },
  puntos:{
    color:'#ccc',
    fontSize:20
  },
  precio:{
    fontSize:40,
    fontWeight:'bold',
    color:'#FEBA17'
  }

})