import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import Footer from "./Footer";

export default function ClienteLayout({ children }) {
    return (
        <View style={globalStyles.containerfluid}>
            <ScrollView contentContainerStyle={styles.content}>
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