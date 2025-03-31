import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View, Button, Image } from 'react-native';


export default function LoginScreen() {
    return (
        <View>
            <Text>Login</Text>
            <View>
                <Controller
                    control={ }
                    name="email"

                    render={({ field: { } }) => (
                        <TextInput
                        />
                    )}
                />
            </View>
        </View>
    )
}
