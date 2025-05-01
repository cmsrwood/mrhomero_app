import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../styles/globalStyles";

export default function DefaultLayout({ children }) {
    return (
        <LinearGradient
            colors={['#2D3036', '#1C1D20']}
            style={globalStyles.containerfluid}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ScrollView contentContainerStyle={styles.content}>
                {children}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        paddingBottom: 70,
    },
});
