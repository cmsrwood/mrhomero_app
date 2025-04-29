import React from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import globalStyles from "../styles/globalStyles";
import Footer from "./Footer";

export default function ClienteLayout({ children, refreshing, onRefresh }) {
    return (
        <View style={globalStyles.containerfluid}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#FFC107"]} // Colores del spinner (Android)
                        progressBackgroundColor="#3A4149" // Fondo del spinner (Android)
                        tintColor="#FFC107" // Color del spinner (iOS)
                    />
                }
            >
                {children}
                <Footer />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        paddingBottom: 70,
    },
});