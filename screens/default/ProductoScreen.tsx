import React from 'react'
import { View, Text,Image, StyleSheet } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import globalStyles from '../../styles/globalStyles';
import useMenu from "../../hooks/useMenu"
import { useRoute } from '@react-navigation/native';


export default function ProductoScreen() {
  const route = useRoute();
  const { id_producto, pro_nom } = route.params || {};
  const { data: producto, loading, error } = useMenu("producto", { id_producto })
  return (
    <DefaultLayout>
      <View>
        <Text style={globalStyles.title}>{pro_nom}</Text>
        <View style={styles.content}>
          <Image source={{ uri: producto.pro_foto }} style={styles.image}/>
          <View style={styles.desp}>
            <Text style={globalStyles.fontHomero}>{producto.pro_precio}</Text>
          </View>
        </View>
      </View>
    </DefaultLayout>
  )
}
const styles = StyleSheet.create({
  content:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 0,
    height:400,
    maxWidth:'100%',
  },
  image:{
    flex:2,
    width:'60%',
    height:'100%',
  },
  desp:{
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    height: '100%',
    alignItems: 'center',

  }

})