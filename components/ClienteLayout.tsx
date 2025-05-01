import React from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import globalStyles from "../styles/globalStyles";
import Footer from "./Footer";
import HeaderCliente from "./HeaderCliente";
import { LinearGradient } from "expo-linear-gradient";

export default function ClienteLayout({ children, refreshing, onRefresh }) {
    return (
        <LinearGradient
            colors={['#2D3036', '#1C1D20']}
            style={globalStyles.containerfluid}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <HeaderCliente />
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#FFC107"]}
                        progressBackgroundColor="#3A4149"
                        tintColor="#FFC107"
                    />
                }
            >
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
