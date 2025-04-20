import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Loader = ({ size = 'large', color = '#ffcc00', text = '' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {text ? <Text style={[styles.text, { color }]}>{text}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Loader;