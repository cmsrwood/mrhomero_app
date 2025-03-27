import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import IndexAdmin from '../screens/admin/IndexAdmin';
import DetailsScreen from '../screens/admin/Details';

const Tab = createBottomTabNavigator();

export default function Nabvar() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerStyle: {
                    backgroundColor: '#000',
                },
                headerTintColor: '#FFD700',
                headerTitleStyle: {
                    display: 'flex',
                    alignContent: 'flex-start',
                    alignItems: 'flex-start',
                    fontWeight: 'bold',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
                    if (route.name === 'Mr.Homero') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Details') {
                        iconName = focused ? 'checkmark-done-outline' : 'checkmark-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#FFFFFF',
                tabBarStyle: {
                    backgroundColor: '#000',
                    borderTopWidth: 0,
                    height: 60,
                }
            })}
        >
            <Tab.Screen name="Mr.Homero" component={IndexAdmin} />
            <Tab.Screen name="Details" component={DetailsScreen} />
        </Tab.Navigator>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181C14',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

