import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import globalStyles from "../styles/globalStyles";
import Footer from "./Footer";
import HeaderCliente from "./HeaderCliente";
import { LinearGradient } from "expo-linear-gradient";
import useClientes from "../hooks/useClientes";
import { useFocusEffect } from "@react-navigation/native";

export default function ClienteLayout({ children, refreshing, onRefresh, refreshCliente = false }) {

    const { data: cliente, isLoading: isLoadingCliente, refetch: refetchCliente } = useClientes("clienteConToken")

    useFocusEffect(
        useCallback(() => {
            refetchCliente();
        }, [])
    )

    useEffect(() => {
        refetchCliente();
        refreshCliente = false
    }, [refreshCliente]);

    return (
        <LinearGradient
            colors={['#2D3036', '#1C1D20']}
            style={globalStyles.containerfluid}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <HeaderCliente cliente={cliente} />
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            onRefresh?.();
                            refetchCliente();
                        }}
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
