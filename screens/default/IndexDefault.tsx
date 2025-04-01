import React from 'react'
import { View, Text } from 'react-native'
import DefaultLayout from '../../components/DefaultLayout'
import { useNavigation } from '@react-navigation/native'

export default function IndexDefault() {

    const navigation = useNavigation();

    return (
        <DefaultLayout>
            <View>
                <Text>IndexDefault</Text>
            </View>
        </DefaultLayout>
    )
}
