import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import IndexAdmin from '../admin/IndexAdmin';
import DetailsScreen from '../admin/Details';

const Tab = createBottomTabNavigator();

export default function Nabvar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Details') {
                        iconName = focused ? 'checkmark-done-outline' : 'checkmark-outline'  ;
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={IndexAdmin} />
            <Tab.Screen name="Details" component={DetailsScreen} />
        </Tab.Navigator>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

