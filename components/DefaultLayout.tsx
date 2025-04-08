import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import Footer from "./Footer";

export default function DefaultLayout({ children }) {
    const navigation = useNavigation();

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
        paddingVertical: 20,
        paddingBottom: 70,
    },
});